-- Secure, atomic Case deletion for Admin and Coordinator.
-- Removes restrictive progress-edit audit rows first; linked meeting records remain readable.
begin;
create or replace function public.wct_delete_case(p_case_id uuid)
returns jsonb language plpgsql security definer
set search_path = public, auth, pg_temp
as $$
declare
 v_uid uuid := auth.uid(); v_role text; v_case public.wct_cases%rowtype;
 v_action_count integer := 0; v_log_count integer := 0; v_audit_count integer := 0;
begin
 select role into v_role from public.wct_users where id=v_uid and active=true;
 if v_uid is null or v_role is null or v_role not in ('admin','coordinator') then
  raise exception 'Hanya Admin atau Koordinator aktif yang dapat menghapus Case.' using errcode='42501';
 end if;
 select * into v_case from public.wct_cases where id=p_case_id for update;
 if not found then raise exception 'Case tidak ditemukan atau sudah dihapus.' using errcode='P0002'; end if;
 select count(*)::integer into v_action_count from public.wct_actions where case_id=p_case_id;
 select count(*)::integer into v_log_count from public.wct_progress_logs where case_id=p_case_id;
 delete from public.wct_progress_log_edits e where e.case_id=p_case_id
  or e.action_id in (select a.id from public.wct_actions a where a.case_id=p_case_id);
 get diagnostics v_audit_count=row_count;
 update public.wct_progress_logs set last_edit_audit_id=null where case_id=p_case_id and last_edit_audit_id is not null;
 update public.wct_actions set latest_progress_log_id=null where case_id=p_case_id and latest_progress_log_id is not null;
 delete from public.wct_cases where id=p_case_id;
 return jsonb_build_object('ok',true,'case_id',p_case_id,'case_code',v_case.case_number,
  'deleted_actions',v_action_count,'deleted_progress_logs',v_log_count,'deleted_audits',v_audit_count);
end; $$;
revoke all on function public.wct_delete_case(uuid) from public,anon;
grant execute on function public.wct_delete_case(uuid) to authenticated;
commit;