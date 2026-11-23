begin;

-- Retire an obsolete SECURITY DEFINER endpoint. No active WCT, HUB Workspace,
-- or ParcelStuck frontend calls this RPC.
revoke all on function public.delete_user(uuid)
  from public, anon, authenticated, service_role;

-- Pin the search path even though client execution is revoked.
alter function public.delete_user(uuid) set search_path = '';

commit;
