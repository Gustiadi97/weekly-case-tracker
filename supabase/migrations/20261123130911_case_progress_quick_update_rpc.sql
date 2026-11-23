create or replace function public.wct_set_action_progress(
  p_action_id uuid,
  p_progress_after integer,
  p_status_after text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_role text;
  v_action public.wct_actions%rowtype;
  v_case_status text;
  v_old_status text;
  v_completed_at timestamptz;
begin
  select u.role into v_role
  from public.wct_users u
  where u.id = v_uid and u.active = true;

  if v_uid is null or v_role is null or v_role = 'viewer' then
    raise exception 'Akun tidak memiliki izin memperbarui progres Action.' using errcode = '42501';
  end if;

  if p_progress_after is null or p_progress_after < 0 or p_progress_after > 100
     or p_status_after not in ('open','in_progress','review','done')
     or (p_status_after = 'done' and p_progress_after <> 100) then
    raise exception 'Progress harus 0–100 dan status Action harus valid. Status Done mensyaratkan progres 100%%.' using errcode = '22023';
  end if;

  select * into v_action
  from public.wct_actions a
  where a.id = p_action_id
  for update;

  if not found then
    raise exception 'Action tidak ditemukan.' using errcode = 'P0002';
  end if;

  select c.status into v_case_status
  from public.wct_cases c
  where c.id = v_action.case_id
  for update;

  if not found then
    raise exception 'Case induk tidak ditemukan.' using errcode = 'P0002';
  end if;

  if v_case_status = 'closed' then
    raise exception 'Case sudah ditutup. Progres Action bersifat read-only.' using errcode = '42501';
  end if;

  if v_role not in ('admin','coordinator') and v_action.assigned_to is distinct from v_uid then
    raise exception 'Hanya PIC yang ditugaskan, Koordinator, atau Admin yang dapat memperbarui progres Action.' using errcode = '42501';
  end if;

  v_old_status := v_action.status;
  v_completed_at := case when p_status_after = 'done' then coalesce(v_action.completed_at, now()) else null end;

  update public.wct_actions
  set progress = p_progress_after,
      status = p_status_after,
      completed_at = v_completed_at,
      updated_by = v_uid,
      updated_at = now()
  where id = v_action.id;

  if v_old_status is distinct from p_status_after then
    insert into public.wct_action_status_history (
      action_id, case_id, from_status, to_status, changed_by, changed_at, source
    ) values (
      v_action.id, v_action.case_id, v_old_status, p_status_after, v_uid, now(), 'quick_progress_update'
    );
  end if;

  if v_role in ('admin','coordinator') and v_case_status = 'open' then
    update public.wct_cases
    set status = 'in_progress', updated_by = v_uid, updated_at = now()
    where id = v_action.case_id;
  end if;

  return jsonb_build_object(
    'ok', true,
    'action_id', v_action.id,
    'case_id', v_action.case_id,
    'progress', p_progress_after,
    'status', p_status_after,
    'completed_at', v_completed_at
  );
end;
$function$;

revoke all on function public.wct_set_action_progress(uuid, integer, text) from public, anon;
grant execute on function public.wct_set_action_progress(uuid, integer, text) to authenticated;
