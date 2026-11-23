create table if not exists public.wct_case_updates (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.wct_cases(id) on delete cascade,
  update_text text not null check (length(btrim(update_text)) > 0),
  blocker text not null default '',
  next_step text not null default '',
  created_by uuid not null references auth.users(id),
  author_name text not null default '',
  created_at timestamptz not null default now(),
  edited_by uuid references auth.users(id),
  edited_at timestamptz
);

create index if not exists wct_case_updates_case_created_idx
  on public.wct_case_updates (case_id, created_at desc);

alter table public.wct_case_updates enable row level security;

revoke all on table public.wct_case_updates from anon, authenticated;
grant select, insert, update on table public.wct_case_updates to authenticated;

drop policy if exists wct_case_updates_read_active on public.wct_case_updates;
create policy wct_case_updates_read_active
  on public.wct_case_updates
  for select to authenticated
  using (private.wct_is_active());

drop policy if exists wct_case_updates_insert_lead_or_case_pic on public.wct_case_updates;
create policy wct_case_updates_insert_lead_or_case_pic
  on public.wct_case_updates
  for insert to authenticated
  with check (
    private.wct_is_active()
    and exists (
      select 1 from public.wct_cases c
      where c.id = case_id and c.status <> 'closed'
    )
    and (
      private.wct_is_lead()
      or (
        exists (
          select 1 from public.wct_users u
          where u.id = (select auth.uid())
            and u.active = true and u.role = 'member'
        )
        and exists (
          select 1 from public.wct_actions a
          where a.case_id = wct_case_updates.case_id
            and a.assigned_to = (select auth.uid())
        )
      )
    )
  );

drop policy if exists wct_case_updates_update_owner_or_lead on public.wct_case_updates;
create policy wct_case_updates_update_owner_or_lead
  on public.wct_case_updates
  for update to authenticated
  using (
    private.wct_is_active()
    and (private.wct_is_lead() or created_by = (select auth.uid()))
    and exists (
      select 1 from public.wct_cases c
      where c.id = case_id and c.status <> 'closed'
    )
  )
  with check (
    private.wct_is_active()
    and (private.wct_is_lead() or created_by = (select auth.uid()))
    and exists (
      select 1 from public.wct_cases c
      where c.id = case_id and c.status <> 'closed'
    )
  );
