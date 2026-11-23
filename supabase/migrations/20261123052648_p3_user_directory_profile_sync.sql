-- P3: keep the PIC directory aligned with canonical user profiles.
-- wct_users is the source of truth for identity, role, area, and account status.
-- wct_team_directory stores the PIC directory's soft-delete flag.

create schema if not exists wct_private;
revoke all on schema wct_private from public;
revoke all on schema wct_private from anon, authenticated;

create or replace function wct_private.sync_team_directory_from_user()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog
as $function$
begin
  insert into public.wct_team_directory
    (user_id, full_name, role, active, deleted, updated_at)
  values
    (new.id, new.full_name, new.role, new.active, false, coalesce(new.updated_at, pg_catalog.now()))
  on conflict (user_id) do update
    set full_name = excluded.full_name,
        role = excluded.role,
        active = excluded.active,
        updated_at = excluded.updated_at;

  return new;
end;
$function$;

revoke all on function wct_private.sync_team_directory_from_user() from public, anon, authenticated;

drop trigger if exists trg_wct_sync_team_directory_from_user on public.wct_users;
create trigger trg_wct_sync_team_directory_from_user
after insert or update of full_name, role, active
on public.wct_users
for each row
execute function wct_private.sync_team_directory_from_user();

-- Backfill any profile that predates the trigger; preserve an existing soft-delete flag.
insert into public.wct_team_directory
  (user_id, full_name, role, active, deleted, updated_at)
select
  u.id, u.full_name, u.role, u.active, false, coalesce(u.updated_at, pg_catalog.now())
from public.wct_users u
on conflict (user_id) do update
  set full_name = excluded.full_name,
      role = excluded.role,
      active = excluded.active,
      updated_at = excluded.updated_at;
