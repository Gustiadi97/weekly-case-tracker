create or replace function private.wct_notify_meeting_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_actor uuid;
  v_user record;
begin
  -- wct_meetings has created_by but does not have updated_by.
  -- Prefer the authenticated caller and fall back to the original creator
  -- for system-originated updates without a JWT.
  v_actor := coalesce(auth.uid(), new.created_by);

  if tg_op='UPDATE'
     and new.title is not distinct from old.title
     and new.meeting_date is not distinct from old.meeting_date
     and new.status is not distinct from old.status then
    return new;
  end if;

  for v_user in
    select id from public.wct_users
    where active = true
      and id <> coalesce(v_actor,'00000000-0000-0000-0000-000000000000'::uuid)
  loop
    perform private.wct_emit_notification(
      v_user.id,
      v_actor,
      case when tg_op='INSERT' then 'meeting_created' else 'meeting_updated' end,
      case when tg_op='INSERT' then 'Weekly Meeting baru dijadwalkan' else 'Weekly Meeting diperbarui' end,
      coalesce(new.title,'Weekly Meeting') || ' · ' || coalesce(new.meeting_date::text,''),
      null,null,new.id
    );
  end loop;
  return new;
end;
$function$;
