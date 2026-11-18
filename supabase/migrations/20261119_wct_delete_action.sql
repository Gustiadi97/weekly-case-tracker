-- Delete one Action and its associated progress/audit history atomically.
-- Only active Admin and Coordinator accounts may perform this operation.
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

  -- Break references between the latest Action/Progress records before
  -- removing the audit and progress rows. All changes remain in one transaction.
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

revoke all on function public.wct_delete_action(uuid) from public, anon;
grant execute on function public.wct_delete_action(uuid) to authenticated;
