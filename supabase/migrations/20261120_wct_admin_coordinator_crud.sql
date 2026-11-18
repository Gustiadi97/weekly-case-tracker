-- Weekly Case Tracker: complete Admin/Coordinator CRUD for PICAPA Actions and Weekly Meeting history.
-- All destructive writes are atomic, role-checked, and executed through SECURITY DEFINER RPCs.
-- No Case or unrelated Action/Meeting records are changed.

begin;

create or replace function public.wct_save_action(
  p_action_id uuid,
  p_case_id uuid,
  p_action jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_role text;
  v_case public.wct_cases%rowtype;
  v_action public.wct_actions%rowtype;
  v_type text := coalesce(p_action->>'action_type','');
  v_title text := trim(coalesce(p_action->>'title',''));
  v_assigned uuid := nullif(p_action->>'assigned_to','')::uuid;
  v_due date := nullif(p_action->>'due_date','')::date;
  v_description text := coalesce(trim(p_action->>'description'),'');
begin
  select role into v_role
  from public.wct_users
  where id = v_uid and active = true;

  if v_uid is null or v_role is null or v_role not in ('admin','coordinator') then
    raise exception 'Hanya Admin atau Koordinator aktif yang dapat membuat atau mengedit Action.'
      using errcode = '42501';
  end if;

  if v_type not in ('corrective','preventive') then
    raise exception 'Jenis Action harus Corrective atau Preventive.'
      using errcode = '22023';
  end if;

  if v_title = '' or v_assigned is null or v_due is null then
    raise exception 'Nama tindakan, PIC, dan target penyelesaian wajib diisi.'
      using errcode = '22023';
  end if;

  select * into v_case
  from public.wct_cases
  where id = p_case_id
  for update;

  if not found then
    raise exception 'Case tidak ditemukan.'
      using errcode = 'P0002';
  end if;

  if v_case.status = 'closed' then
    raise exception 'Case sudah ditutup. Action tidak dapat diubah.'
      using errcode = '42501';
  end if;

  if p_action_id is null then
    insert into public.wct_actions (
      case_id, action_type, title, description, assigned_to, due_date,
      status, progress, created_by, updated_by, created_at, updated_at
    ) values (
      p_case_id, v_type, v_title, v_description, v_assigned, v_due,
      'open', 0, v_uid, v_uid, now(), now()
    )
    returning * into v_action;
  else
    select * into v_action
    from public.wct_actions
    where id = p_action_id and case_id = p_case_id
    for update;

    if not found then
      raise exception 'Action tidak ditemukan pada Case tersebut.'
        using errcode = 'P0002';
    end if;

    if v_action.action_type <> v_type then
      raise exception 'Jenis Action tidak sesuai dengan kelompoknya.'
        using errcode = '22023';
    end if;

    update public.wct_actions
    set title = v_title,
        description = v_description,
        assigned_to = v_assigned,
        due_date = v_due,
        updated_by = v_uid,
        updated_at = now()
    where id = p_action_id
    returning * into v_action;
  end if;

  return to_jsonb(v_action);
end;
$$;

create or replace function public.wct_delete_action(
  p_action_id uuid
) returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_role text;
  v_action public.wct_actions%rowtype;
  v_deleted_logs integer := 0;
  v_deleted_audits integer := 0;
begin
  select role into v_role
  from public.wct_users
  where id = v_uid and active = true;

  if v_uid is null or v_role is null or v_role not in ('admin','coordinator') then
    raise exception 'Hanya Admin atau Koordinator aktif yang dapat menghapus Action.'
      using errcode = '42501';
  end if;

  select * into v_action
  from public.wct_actions
  where id = p_action_id
  for update;

  if not found then
    raise exception 'Action tidak ditemukan atau sudah dihapus.'
      using errcode = 'P0002';
  end if;

  if exists (
    select 1 from public.wct_cases
    where id = v_action.case_id and status = 'closed'
  ) then
    raise exception 'Case sudah ditutup. Action tidak dapat dihapus.'
      using errcode = '42501';
  end if;

  update public.wct_progress_logs
  set last_edit_audit_id = null
  where action_id = p_action_id
    and last_edit_audit_id is not null;

  delete from public.wct_progress_log_edits
  where action_id = p_action_id;
  get diagnostics v_deleted_audits = row_count;

  update public.wct_actions
  set latest_progress_log_id = null
  where id = p_action_id;

  delete from public.wct_progress_logs
  where action_id = p_action_id;
  get diagnostics v_deleted_logs = row_count;

  delete from public.wct_actions
  where id = p_action_id;

  update public.wct_cases
  set updated_by = v_uid,
      updated_at = now()
  where id = v_action.case_id;

  return jsonb_build_object(
    'ok', true,
    'action_id', p_action_id,
    'case_id', v_action.case_id,
    'deleted_progress_logs', v_deleted_logs,
    'deleted_audits', v_deleted_audits
  );
end;
$$;

create or replace function public.wct_delete_meeting(
  p_meeting_id uuid
) returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_role text;
  v_meeting public.wct_meetings%rowtype;
  v_deleted_links integer := 0;
begin
  select role into v_role
  from public.wct_users
  where id = v_uid and active = true;

  if v_uid is null or v_role is null or v_role not in ('admin','coordinator') then
    raise exception 'Hanya Admin atau Koordinator aktif yang dapat menghapus riwayat Weekly Meeting.'
      using errcode = '42501';
  end if;

  select * into v_meeting
  from public.wct_meetings
  where id = p_meeting_id
  for update;

  if not found then
    raise exception 'Riwayat Weekly Meeting tidak ditemukan atau sudah dihapus.'
      using errcode = 'P0002';
  end if;

  -- Remove only the association rows. The related Case and Action records remain intact.
  delete from public.wct_meeting_cases
  where meeting_id = p_meeting_id;
  get diagnostics v_deleted_links = row_count;

  delete from public.wct_meetings
  where id = p_meeting_id;

  return jsonb_build_object(
    'ok', true,
    'meeting_id', p_meeting_id,
    'deleted_case_links', v_deleted_links
  );
end;
$$;

revoke all on function public.wct_save_action(uuid,uuid,jsonb) from public, anon;
revoke all on function public.wct_delete_action(uuid) from public, anon;
revoke all on function public.wct_delete_meeting(uuid) from public, anon;

grant execute on function public.wct_save_action(uuid,uuid,jsonb) to authenticated;
grant execute on function public.wct_delete_action(uuid) to authenticated;
grant execute on function public.wct_delete_meeting(uuid) to authenticated;

-- Prevent direct client writes that bypass the role checks above.
-- Case, progress, and edit workflows continue through their existing atomic RPCs.
revoke insert, update, delete on table public.wct_actions from anon, authenticated;

commit;
