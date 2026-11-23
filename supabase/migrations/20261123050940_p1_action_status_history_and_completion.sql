begin;

alter table public.wct_actions
  add column if not exists completed_at timestamptz;

update public.wct_actions a
set completed_at = coalesce(
  (
    select l.created_at
    from public.wct_progress_logs l
    where l.id = a.latest_progress_log_id
      and l.status_after = 'done'
      and l.progress_after = 100
  ),
  (
    select max(l.created_at)
    from public.wct_progress_logs l
    where l.action_id = a.id
      and l.status_after = 'done'
      and l.progress_after = 100
  ),
  a.updated_at
)
where a.status = 'done'
  and a.progress = 100
  and a.completed_at is null;

create table if not exists public.wct_action_status_history (
  id uuid primary key default gen_random_uuid(),
  action_id uuid not null references public.wct_actions(id) on delete cascade,
  case_id uuid not null references public.wct_cases(id) on delete cascade,
  from_status text,
  to_status text not null,
  changed_by uuid references auth.users(id) on delete set null,
  changed_at timestamptz not null default now(),
  source text not null default 'action_update',
  constraint wct_action_status_history_from_status_check
    check (from_status is null or from_status in ('open','in_progress','review','done')),
  constraint wct_action_status_history_to_status_check
    check (to_status in ('open','in_progress','review','done'))
);

create index if not exists wct_action_status_history_case_time_idx
  on public.wct_action_status_history(case_id, changed_at desc);
create index if not exists wct_action_status_history_action_time_idx
  on public.wct_action_status_history(action_id, changed_at desc);

alter table public.wct_action_status_history enable row level security;
revoke all on table public.wct_action_status_history from public, anon, authenticated;
grant select on table public.wct_action_status_history to authenticated;

drop policy if exists wct_action_status_history_read_active
  on public.wct_action_status_history;
create policy wct_action_status_history_read_active
  on public.wct_action_status_history
  for select to authenticated
  using ((select private.wct_is_active()));

comment on table public.wct_action_status_history is
  'Audit trail of Action status transitions. Kept separate from progress logs.';

create or replace function private.wct_log_action_status_history()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_source text;
begin
  if tg_op = 'INSERT' then
    insert into public.wct_action_status_history (
      action_id, case_id, from_status, to_status, changed_by, changed_at, source
    ) values (
      new.id, new.case_id, null, new.status, auth.uid(), now(), 'action_created'
    );
    return new;
  end if;

  if old.status is distinct from new.status then
    v_source := nullif(current_setting('wct.action_status_source', true), '');
    if v_source is null then
      v_source := case
        when old.progress is distinct from new.progress then 'progress_update'
        else 'action_update'
      end;
    end if;

    insert into public.wct_action_status_history (
      action_id, case_id, from_status, to_status, changed_by, changed_at, source
    ) values (
      new.id, new.case_id, old.status, new.status, auth.uid(), now(), v_source
    );
  end if;
  return new;
end;
$function$;

drop trigger if exists wct_actions_log_status_history on public.wct_actions;
create trigger wct_actions_log_status_history
after insert or update on public.wct_actions
for each row execute function private.wct_log_action_status_history();

create or replace function private.wct_sync_action_completed_at()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  if new.status = 'done' then
    if tg_op = 'INSERT' then
      new.completed_at := coalesce(new.completed_at, now());
    elsif old.status is distinct from new.status then
      new.completed_at := now();
    else
      new.completed_at := coalesce(new.completed_at, old.completed_at, now());
    end if;
  else
    new.completed_at := null;
  end if;
  return new;
end;
$function$;

drop trigger if exists wct_actions_sync_completed_at on public.wct_actions;
create trigger wct_actions_sync_completed_at
before insert or update of status on public.wct_actions
for each row execute function private.wct_sync_action_completed_at();

with ordered_logs as (
  select
    l.*,
    coalesce(
      lag(l.status_after) over (
        partition by l.action_id order by l.created_at, l.id
      ),
      'open'
    ) as previous_status
  from public.wct_progress_logs l
)
insert into public.wct_action_status_history (
  action_id, case_id, from_status, to_status, changed_by, changed_at, source
)
select
  action_id, case_id, previous_status, status_after, created_by,
  created_at, 'progress_history_backfill'
from ordered_logs
where previous_status is distinct from status_after;

create or replace function public.wct_move_action_status(
  p_action_id uuid,
  p_status text
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
begin
  select u.role into v_role
  from public.wct_users u
  where u.id = v_uid and u.active = true;

  if v_uid is null or v_role not in ('admin','coordinator') then
    raise exception 'Hanya Admin atau Koordinator aktif yang dapat memindahkan status Action.'
      using errcode = '42501';
  end if;

  if p_status not in ('open','in_progress','review','done') then
    raise exception 'Status tujuan tidak valid.'
      using errcode = '22023';
  end if;

  select * into v_action
  from public.wct_actions a
  where a.id = p_action_id
  for update;

  if not found then
    raise exception 'Action tidak ditemukan.'
      using errcode = 'P0002';
  end if;

  if exists (
    select 1 from public.wct_cases c
    where c.id = v_action.case_id and c.status = 'closed'
  ) then
    raise exception 'Case sudah ditutup. Status Action tidak dapat diubah.'
      using errcode = '42501';
  end if;

  if p_status = 'done' and coalesce(v_action.progress,0) <> 100 then
    raise exception 'Action hanya dapat dipindahkan ke Done jika progress sudah 100%%.'
      using errcode = '22023';
  end if;

  if v_action.status = p_status then
    return jsonb_build_object(
      'ok', true, 'changed', false, 'action_id', v_action.id,
      'status', v_action.status, 'completed_at', v_action.completed_at
    );
  end if;

  perform set_config('wct.action_status_source', 'kanban_drag', true);

  update public.wct_actions
  set status = p_status, updated_by = v_uid, updated_at = now()
  where id = p_action_id
  returning * into v_action;

  return jsonb_build_object(
    'ok', true, 'changed', true, 'action_id', v_action.id,
    'status', v_action.status, 'completed_at', v_action.completed_at
  );
end;
$function$;

revoke all on function public.wct_move_action_status(uuid, text) from public, anon;
grant execute on function public.wct_move_action_status(uuid, text) to authenticated;

revoke update (status, updated_at, updated_by)
  on table public.wct_actions
  from authenticated;

commit;
