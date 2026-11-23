do $migration$
declare
  v_definition text;
begin
  select pg_get_functiondef(
    'public.wct_save_meeting_with_items(uuid,jsonb,jsonb)'::regprocedure
  ) into v_definition;

  if position($old$'summary', ''$old$ in v_definition)=0
     or position($old$'decisions', ''$old$ in v_definition)=0
     or position($old$'next_steps', ''$old$ in v_definition)=0 then
    raise exception 'Meeting RPC compatibility markers were not found; no function was changed.';
  end if;

  v_definition := replace(v_definition,$old$'summary', ''$old$,$new$'summary', coalesce(p_meeting->>'summary','')$new$);
  v_definition := replace(v_definition,$old$'decisions', ''$old$,$new$'decisions', coalesce(p_meeting->>'decisions','')$new$);
  v_definition := replace(v_definition,$old$'next_steps', ''$old$,$new$'next_steps', coalesce(p_meeting->>'next_steps','')$new$);

  if position($old$'summary', ''$old$ in v_definition)>0
     or position($old$'decisions', ''$old$ in v_definition)>0
     or position($old$'next_steps', ''$old$ in v_definition)>0 then
    raise exception 'Meeting RPC compatibility replacement was incomplete.';
  end if;

  execute v_definition;
end;
$migration$;
