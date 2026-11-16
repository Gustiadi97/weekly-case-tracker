-- Weekly Case Tracker: atomic PostgreSQL workflows for the Supabase migration.
-- All functions verify the signed-in user and run as SECURITY DEFINER so each workflow
-- is committed atomically. No existing tables or data are dropped or rewritten.

create or replace function public.wct_create_case(
  p_case jsonb,
  p_actions jsonb default '[]'::jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_role text;
  v_case_id uuid := coalesce(nullif(p_case->>'id','')::uuid, gen_random_uuid());
  v_counter bigint;
  v_case_number text;
  v_action jsonb;
  v_case public.wct_cases%rowtype;
begin
  select role into v_role
  from public.wct_users
  where id = v_uid and active = true;

  if v_uid is null or v_role is null or v_role not in ('admin','coordinator') then
    raise exception 'Hanya Admin atau Koordinator aktif yang dapat membuat Case.' using errcode = '42501';
  end if;

  if nullif(trim(p_case->>'title'),'') is null
     or nullif(trim(p_case->>'problem_identification'),'') is null then
    raise exception 'Judul dan Problem Identification wajib diisi.' using errcode = '22023';
  end if;

  insert into public.wct_counters(counter_key, value, updated_at)
  values ('case_sequence', 1, now())
  on conflict (counter_key)
  do update set value = public.wct_counters.value + 1, updated_at = now()
  returning value into v_counter;

  v_case_number := coalesce(
    nullif(p_case->>'case_number',''),
    nullif(p_case->>'case_code',''),
    'CASE-' || lpad(v_counter::text, 3, '0')
  );

  insert into public.wct_cases (
    id, case_number, hub_code, category, division, title,
    problem_identification, occurred_on, target_date, reporter,
    priority, status, created_by, updated_by, created_at, updated_at
  ) values (
    v_case_id, v_case_number,
    nullif(upper(trim(p_case->>'hub_code')),''),
    nullif(trim(p_case->>'category'),''),
    nullif(trim(p_case->>'division'),''),
    trim(p_case->>'title'),
    trim(p_case->>'problem_identification'),
    nullif(p_case->>'occurred_on','')::date,
    nullif(p_case->>'target_date','')::date,
    nullif(trim(p_case->>'reporter'),''),
    coalesce(nullif(p_case->>'priority',''),'Medium'),
    coalesce(nullif(p_case->>'status',''),'open'),
    v_uid, v_uid, now(), now()
  ) returning * into v_case;

  if jsonb_typeof(coalesce(p_actions,'[]'::jsonb)) <> 'array' then
    raise exception 'Daftar Action tidak valid.' using errcode = '22023';
  end if;

  for v_action in select value from jsonb_array_elements(coalesce(p_actions,'[]'::jsonb))
  loop
    if nullif(trim(v_action->>'title'),'') is not null then
      if coalesce(v_action->>'action_type','') not in ('corrective','preventive') then
        raise exception 'Jenis Action tidak valid.' using errcode = '22023';
      end if;
      insert into public.wct_actions (
        case_id, action_type, title, description, assigned_to,
        due_date, status, progress, created_by, created_at, updated_at
      ) values (
        v_case_id, v_action->>'action_type', trim(v_action->>'title'),
        coalesce(v_action->>'description',''),
        nullif(v_action->>'assigned_to','')::uuid,
        nullif(v_action->>'due_date','')::date,
        'open', 0, v_uid, now(), now()
      );
    end if;
  end loop;

  return to_jsonb(v_case);
end;
$$;

create or replace function public.wct_update_progress(
  p_action_id uuid,
  p_update_text text,
  p_progress_after integer,
  p_status_after text,
  p_blocker text default '',
  p_next_step text default ''
) returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_role text;
  v_action public.wct_actions%rowtype;
  v_log public.wct_progress_logs%rowtype;
begin
  select role into v_role from public.wct_users where id = v_uid and active = true;
  if v_uid is null or v_role is null or v_role = 'viewer' then
    raise exception 'Akun tidak memiliki izin memperbarui progress.' using errcode = '42501';
  end if;

  select * into v_action
  from public.wct_actions
  where id = p_action_id
  for update;

  if not found then
    raise exception 'Action tidak ditemukan.' using errcode = 'P0002';
  end if;

  if v_role not in ('admin','coordinator') and v_action.assigned_to is distinct from v_uid then
    raise exception 'Kamu bukan PIC yang ditugaskan pada Action ini.' using errcode = '42501';
  end if;

  if p_progress_after is null or p_progress_after < 0 or p_progress_after > 100
     or coalesce(trim(p_update_text),'') = ''
     or p_status_after not in ('open','in_progress','review','done')
     or (p_status_after = 'done' and p_progress_after <> 100) then
    raise exception 'Data progress atau status tidak valid.' using errcode = '22023';
  end if;

  if exists (
    select 1 from public.wct_cases
    where id = v_action.case_id and status = 'closed'
  ) then
    raise exception 'Case sudah ditutup.' using errcode = '42501';
  end if;

  insert into public.wct_progress_logs (
    case_id, action_id, update_text, progress_before, progress_after,
    status_after, blocker, next_step, created_by, created_at
  ) values (
    v_action.case_id, v_action.id, trim(p_update_text), coalesce(v_action.progress,0),
    p_progress_after, p_status_after, coalesce(p_blocker,''), coalesce(p_next_step,''), v_uid, now()
  ) returning * into v_log;

  update public.wct_actions
  set progress = p_progress_after,
      status = p_status_after,
      latest_progress_log_id = v_log.id,
      updated_by = v_uid,
      updated_at = now()
  where id = v_action.id;

  if v_role in ('admin','coordinator') then
    update public.wct_cases
    set status = 'in_progress', updated_by = v_uid, updated_at = now()
    where id = v_action.case_id and status = 'open';
  end if;

  return to_jsonb(v_log);
end;
$$;

create or replace function public.wct_edit_progress(
  p_log_id uuid,
  p_update_text text,
  p_progress_after integer,
  p_status_after text,
  p_blocker text default '',
  p_next_step text default ''
) returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_role text;
  v_log public.wct_progress_logs%rowtype;
  v_action public.wct_actions%rowtype;
  v_before jsonb;
  v_after jsonb;
  v_latest boolean;
  v_audit_id uuid;
begin
  select role into v_role from public.wct_users where id = v_uid and active = true;
  if v_uid is null or v_role is null or v_role = 'viewer' then
    raise exception 'Akun tidak memiliki izin mengoreksi progress.' using errcode = '42501';
  end if;

  select * into v_log from public.wct_progress_logs where id = p_log_id for update;
  if not found then raise exception 'Riwayat progress tidak ditemukan.' using errcode = 'P0002'; end if;

  select * into v_action from public.wct_actions where id = v_log.action_id for update;
  if not found then raise exception 'Action tidak ditemukan.' using errcode = 'P0002'; end if;

  if v_role not in ('admin','coordinator') and v_log.created_by is distinct from v_uid then
    raise exception 'Tidak memiliki izin edit riwayat ini.' using errcode = '42501';
  end if;
  if v_role not in ('admin','coordinator') and v_action.assigned_to is distinct from v_uid then
    raise exception 'Hanya PIC aktif atau Koordinator/Admin yang dapat mengoreksi riwayat.' using errcode = '42501';
  end if;

  select (latest.id = v_log.id) into v_latest
  from (
    select id from public.wct_progress_logs
    where action_id = v_log.action_id
    order by created_at desc, id desc
    limit 1
  ) latest;

  if p_progress_after is null or p_progress_after < 0 or p_progress_after > 100
     or coalesce(trim(p_update_text),'') = ''
     or p_status_after not in ('open','in_progress','review','done')
     or (p_status_after = 'done' and p_progress_after <> 100) then
    raise exception 'Data progress atau status tidak valid.' using errcode = '22023';
  end if;

  v_before := jsonb_build_object(
    'update_text',v_log.update_text,'progress_before',v_log.progress_before,
    'progress_after',v_log.progress_after,'blocker',v_log.blocker,
    'next_step',v_log.next_step,'status_after',v_log.status_after
  );
  v_after := jsonb_build_object(
    'update_text',trim(p_update_text),'progress_before',v_log.progress_before,
    'progress_after',p_progress_after,'blocker',coalesce(p_blocker,''),
    'next_step',coalesce(p_next_step,''),'status_after',p_status_after
  );
  v_audit_id := gen_random_uuid();

  update public.wct_progress_logs
  set update_text = trim(p_update_text),
      progress_after = p_progress_after,
      status_after = p_status_after,
      blocker = coalesce(p_blocker,''),
      next_step = coalesce(p_next_step,''),
      edited_by = v_uid,
      edited_at = now(),
      last_edit_audit_id = v_audit_id
  where id = p_log_id;

  insert into public.wct_progress_log_edits (
    id, log_id, case_id, action_id, edited_by, created_at,
    before_data, after_data, latest_update
  ) values (
    v_audit_id, p_log_id, v_log.case_id, v_log.action_id, v_uid, now(),
    v_before, v_after, coalesce(v_latest,false)
  );

  if coalesce(v_latest,false) then
    update public.wct_actions
    set progress = p_progress_after,
        status = p_status_after,
        latest_progress_log_id = p_log_id,
        updated_by = v_uid,
        updated_at = now()
    where id = v_action.id;
  end if;

  return jsonb_build_object('id',p_log_id,'latest_update',coalesce(v_latest,false),'audit_id',v_audit_id);
end;
$$;

create or replace function public.wct_save_case_and_actions(
  p_case_id uuid,
  p_case jsonb,
  p_actions jsonb default '[]'::jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_role text;
  v_case public.wct_cases%rowtype;
  v_spec jsonb;
  v_action_id uuid;
  v_type text;
  v_title text;
begin
  select role into v_role from public.wct_users where id = v_uid and active = true;
  if v_uid is null or v_role not in ('admin','coordinator') then
    raise exception 'Hanya Admin atau Koordinator yang dapat mengubah Case.' using errcode = '42501';
  end if;

  select * into v_case from public.wct_cases where id = p_case_id for update;
  if not found then raise exception 'Case tidak ditemukan.' using errcode = 'P0002'; end if;
  if v_case.status = 'closed' then raise exception 'Case sudah ditutup dan tidak dapat diedit.' using errcode = '42501'; end if;

  update public.wct_cases
  set hub_code = upper(nullif(trim(p_case->>'hub_code'),'')),
      category = nullif(trim(p_case->>'category'),''),
      division = nullif(trim(p_case->>'division'),''),
      title = trim(p_case->>'title'),
      status = coalesce(nullif(p_case->>'status',''),'open'),
      priority = coalesce(nullif(p_case->>'priority',''),'Medium'),
      problem_identification = trim(p_case->>'problem_identification'),
      occurred_on = nullif(p_case->>'occurred_on','')::date,
      target_date = nullif(p_case->>'target_date','')::date,
      reporter = nullif(trim(p_case->>'reporter'),''),
      updated_by = v_uid,
      updated_at = now()
  where id = p_case_id;

  if jsonb_typeof(coalesce(p_actions,'[]'::jsonb)) <> 'array' then
    raise exception 'Daftar Action tidak valid.' using errcode = '22023';
  end if;

  for v_spec in select value from jsonb_array_elements(coalesce(p_actions,'[]'::jsonb))
  loop
    v_type := v_spec->>'action_type';
    v_title := coalesce(trim(v_spec->>'title'),'');
    v_action_id := nullif(v_spec->>'id','')::uuid;

    if v_type not in ('corrective','preventive') then
      raise exception 'Jenis Action tidak valid.' using errcode = '22023';
    end if;

    if v_action_id is not null then
      update public.wct_actions
      set title = v_title,
          assigned_to = nullif(v_spec->>'assigned_to','')::uuid,
          due_date = nullif(v_spec->>'due_date','')::date,
          updated_by = v_uid,
          updated_at = now()
      where id = v_action_id and case_id = p_case_id and action_type = v_type;
      if not found then raise exception 'Action yang akan diedit tidak ditemukan.' using errcode = 'P0002'; end if;
    elsif v_title <> '' then
      insert into public.wct_actions (
        case_id, action_type, title, description, assigned_to, due_date,
        status, progress, created_by, created_at, updated_at
      ) values (
        p_case_id, v_type, v_title, '', nullif(v_spec->>'assigned_to','')::uuid,
        nullif(v_spec->>'due_date','')::date, 'open', 0, v_uid, now(), now()
      );
    end if;
  end loop;

  return jsonb_build_object('ok',true,'case_id',p_case_id);
end;
$$;

revoke all on function public.wct_create_case(jsonb,jsonb) from public, anon;
revoke all on function public.wct_update_progress(uuid,text,integer,text,text,text) from public, anon;
revoke all on function public.wct_edit_progress(uuid,text,integer,text,text,text) from public, anon;
revoke all on function public.wct_save_case_and_actions(uuid,jsonb,jsonb) from public, anon;

grant execute on function public.wct_create_case(jsonb,jsonb) to authenticated;
grant execute on function public.wct_update_progress(uuid,text,integer,text,text,text) to authenticated;
grant execute on function public.wct_edit_progress(uuid,text,integer,text,text,text) to authenticated;
grant execute on function public.wct_save_case_and_actions(uuid,jsonb,jsonb) to authenticated;
