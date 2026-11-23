
create table if not exists public.wct_deleted_user_archive (
  user_id uuid primary key,
  full_name text not null,
  role text not null,
  employee_id text,
  area_name text,
  created_at timestamptz,
  deleted_at timestamptz not null default now(),
  deleted_by uuid,
  deleted_by_name text not null default ''
);
alter table public.wct_deleted_user_archive enable row level security;
revoke all on table public.wct_deleted_user_archive from anon, authenticated;
grant select on table public.wct_deleted_user_archive to authenticated;
drop policy if exists wct_deleted_user_archive_read_active on public.wct_deleted_user_archive;
create policy wct_deleted_user_archive_read_active on public.wct_deleted_user_archive
  for select to authenticated using (private.wct_is_active());

alter table public.wct_users drop constraint if exists wct_users_id_fkey;
alter table public.wct_users add constraint wct_users_id_fkey
  foreign key (id) references auth.users(id) on delete cascade;
alter table public.wct_team_directory drop constraint if exists wct_team_directory_user_id_fkey;
alter table public.wct_team_directory add constraint wct_team_directory_user_id_fkey
  foreign key (user_id) references public.wct_users(id) on delete cascade;
alter table public.wct_actions drop constraint if exists wct_actions_assigned_to_fkey;
alter table public.wct_actions add constraint wct_actions_assigned_to_fkey
  foreign key (assigned_to) references public.wct_users(id) on delete set null;

alter table public.wct_users drop constraint if exists wct_users_created_by_fkey;
alter table public.wct_users add constraint wct_users_created_by_fkey
  foreign key (created_by) references auth.users(id) on delete set null;
alter table public.wct_cases drop constraint if exists wct_cases_updated_by_fkey;
alter table public.wct_cases add constraint wct_cases_updated_by_fkey
  foreign key (updated_by) references auth.users(id) on delete set null;
alter table public.wct_cases drop constraint if exists wct_cases_closed_by_fkey;
alter table public.wct_cases add constraint wct_cases_closed_by_fkey
  foreign key (closed_by) references auth.users(id) on delete set null;
alter table public.wct_actions drop constraint if exists wct_actions_updated_by_fkey;
alter table public.wct_actions add constraint wct_actions_updated_by_fkey
  foreign key (updated_by) references auth.users(id) on delete set null;
alter table public.wct_progress_logs drop constraint if exists wct_progress_logs_edited_by_fkey;
alter table public.wct_progress_logs add constraint wct_progress_logs_edited_by_fkey
  foreign key (edited_by) references auth.users(id) on delete set null;
alter table public.wct_case_updates drop constraint if exists wct_case_updates_edited_by_fkey;
alter table public.wct_case_updates add constraint wct_case_updates_edited_by_fkey
  foreign key (edited_by) references auth.users(id) on delete set null;
alter table public.wct_app_settings drop constraint if exists wct_app_settings_updated_by_fkey;
alter table public.wct_app_settings add constraint wct_app_settings_updated_by_fkey
  foreign key (updated_by) references auth.users(id) on delete set null;
alter table public.hw_workspace_invites alter column invited_by drop not null;
alter table public.hw_workspace_invites drop constraint if exists hw_workspace_invites_invited_by_fkey;
alter table public.hw_workspace_invites add constraint hw_workspace_invites_invited_by_fkey
  foreign key (invited_by) references auth.users(id) on delete set null;

alter table public.wct_cases drop constraint if exists wct_cases_created_by_fkey;
alter table public.wct_actions drop constraint if exists wct_actions_created_by_fkey;
alter table public.wct_progress_logs drop constraint if exists wct_progress_logs_created_by_fkey;
alter table public.wct_progress_log_edits drop constraint if exists wct_progress_log_edits_edited_by_fkey;
alter table public.wct_meetings drop constraint if exists wct_meetings_created_by_fkey;
alter table public.wct_case_updates drop constraint if exists wct_case_updates_created_by_fkey;

create or replace function public.wct_prepare_user_deletion(p_user_id uuid,p_actor_id uuid)
returns jsonb language plpgsql security definer set search_path = ''
as $function$
declare
  v_actor_role text;
  v_actor_name text;
  v_target public.wct_users%rowtype;
  v_admin_count integer;
begin
  if p_user_id is null or p_actor_id is null or p_user_id = p_actor_id then
    raise exception 'Pilih akun lain. Admin tidak dapat menghapus akunnya sendiri.' using errcode = '42501';
  end if;
  select u.role,u.full_name into v_actor_role,v_actor_name
  from public.wct_users u where u.id=p_actor_id and u.active=true;
  if v_actor_role is distinct from 'admin' then
    raise exception 'Hanya Admin aktif yang dapat menghapus akun pengguna.' using errcode = '42501';
  end if;
  select * into v_target from public.wct_users u where u.id=p_user_id for update;
  if not found then
    raise exception 'Akun pengguna tidak ditemukan atau sudah dihapus.' using errcode = 'P0002';
  end if;
  if v_target.role='admin' then
    select count(*)::integer into v_admin_count from public.wct_users u where u.role='admin' and u.active=true;
    if v_admin_count<=1 then
      raise exception 'Admin terakhir tidak dapat dihapus. Tetapkan Admin pengganti terlebih dahulu.' using errcode = '42501';
    end if;
  end if;
  if exists(select 1 from public.hw_workspaces w where w.owner_id=p_user_id) then
    raise exception 'Akun ini masih menjadi pemilik Workspace. Pindahkan kepemilikan Workspace terlebih dahulu.' using errcode = '42501';
  end if;
  if exists(select 1 from public.hw_platform_admins a where a.user_id=p_user_id) then
    raise exception 'Akun ini masih menjadi Admin Platform Hub Workspace. Lepaskan peran Platform Admin terlebih dahulu.' using errcode = '42501';
  end if;
  insert into public.wct_deleted_user_archive(
    user_id,full_name,role,employee_id,area_name,created_at,deleted_at,deleted_by,deleted_by_name
  ) values (
    v_target.id,v_target.full_name,v_target.role,v_target.employee_id,v_target.area_name,
    v_target.created_at,now(),p_actor_id,coalesce(v_actor_name,'Admin')
  )
  on conflict(user_id) do update set
    full_name=excluded.full_name,role=excluded.role,employee_id=excluded.employee_id,
    area_name=excluded.area_name,created_at=excluded.created_at,deleted_at=now(),
    deleted_by=p_actor_id,deleted_by_name=excluded.deleted_by_name;
  return jsonb_build_object('ok',true,'user_id',v_target.id,'full_name',v_target.full_name,'login_id',v_target.login_id,'role',v_target.role);
end;
$function$;
revoke all on function public.wct_prepare_user_deletion(uuid,uuid) from public,anon,authenticated;
grant execute on function public.wct_prepare_user_deletion(uuid,uuid) to service_role;
