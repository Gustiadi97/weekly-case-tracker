-- Weekly Meeting: structured discussion points with optional Case / Project creation.
-- Each agenda point is independent; linked Cases remain first-class Case Monitoring records.

begin;

create table if not exists public.wct_meeting_items (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.wct_meetings(id) on delete cascade,
  sort_order integer not null default 0,
  kind text not null default 'discussion'
    check (kind in ('discussion','existing_case','new_case')),
  title text not null,
  summary text not null default '',
  decisions text not null default '',
  next_step text not null default '',
  case_id uuid references public.wct_cases(id) on delete set null,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists wct_meeting_items_meeting_order_idx
  on public.wct_meeting_items(meeting_id, sort_order, created_at);
create index if not exists wct_meeting_items_case_id_idx
  on public.wct_meeting_items(case_id)
  where case_id is not null;

alter table public.wct_meeting_items enable row level security;

drop policy if exists wct_meeting_items_read_active on public.wct_meeting_items;
create policy wct_meeting_items_read_active
  on public.wct_meeting_items
  for select
  to authenticated
  using ((select private.wct_is_active()));

revoke all on table public.wct_meeting_items from public, anon, authenticated;
grant select on table public.wct_meeting_items to authenticated;

create or replace function public.wct_save_meeting_with_items(
  p_meeting_id uuid,
  p_meeting jsonb,
  p_items jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_role text;
  v_meeting public.wct_meetings%rowtype;
  v_meeting_id uuid := p_meeting_id;
  v_title text := trim(coalesce(p_meeting->>'title',''));
  v_hub_code text := upper(trim(coalesce(p_meeting->>'hub_code','')));
  v_meeting_date date;
  v_item jsonb;
  v_project jsonb;
  v_actions jsonb;
  v_created_case jsonb;
  v_case_payload jsonb;
  v_item_id uuid;
  v_case_id uuid;
  v_kind text;
  v_item_title text;
  v_summary text;
  v_decisions text;
  v_next_step text;
  v_case_exists boolean;
  v_saved_ids uuid[] := array[]::uuid[];
  v_case_ids jsonb := '[]'::jsonb;
  v_saved_items jsonb := '[]'::jsonb;
  v_order integer;
begin
  select role into v_role
  from public.wct_users
  where id = v_uid and active = true;

  if v_uid is null or v_role is null or v_role not in ('admin','coordinator') then
    raise exception 'Hanya Admin atau Koordinator aktif yang dapat menyimpan hasil Weekly Meeting.'
      using errcode = '42501';
  end if;

  if v_title = '' or v_hub_code = '' or nullif(p_meeting->>'meeting_date','') is null then
    raise exception 'Judul, tanggal, dan HUB meeting wajib diisi.'
      using errcode = '22023';
  end if;
  v_meeting_date := (p_meeting->>'meeting_date')::date;

  if jsonb_typeof(coalesce(p_items,'null'::jsonb)) <> 'array'
     or jsonb_array_length(coalesce(p_items,'[]'::jsonb)) < 1 then
    raise exception 'Tambahkan minimal satu poin pembahasan pada meeting.'
      using errcode = '22023';
  end if;

  if v_meeting_id is null then
    insert into public.wct_meetings (
      title, meeting_date, notes, status, created_by, created_at, updated_at
    ) values (
      v_title,
      v_meeting_date,
      jsonb_build_object(
        'wct_meeting_payload', 1,
        'summary', '',
        'decisions', '',
        'next_steps', '',
        'case_ids', '[]'::jsonb,
        'hub_code', v_hub_code
      )::text,
      'planned',
      v_uid,
      now(),
      now()
    )
    returning * into v_meeting;
    v_meeting_id := v_meeting.id;
  else
    select * into v_meeting
    from public.wct_meetings
    where id = v_meeting_id
    for update;

    if not found then
      raise exception 'Riwayat Weekly Meeting tidak ditemukan.'
        using errcode = 'P0002';
    end if;

    update public.wct_meetings
    set title = v_title,
        meeting_date = v_meeting_date,
        updated_at = now()
    where id = v_meeting_id
    returning * into v_meeting;
  end if;

  for v_item, v_order in
    select value, (ordinality - 1)::integer
    from jsonb_array_elements(p_items) with ordinality
  loop
    v_kind := coalesce(v_item->>'kind','discussion');
    v_item_title := trim(coalesce(v_item->>'title',''));
    v_summary := coalesce(v_item->>'summary','');
    v_decisions := coalesce(v_item->>'decisions','');
    v_next_step := coalesce(v_item->>'next_step','');
    v_item_id := nullif(v_item->>'id','')::uuid;
    v_case_id := nullif(v_item->>'case_id','')::uuid;

    if v_kind not in ('discussion','existing_case','new_case') then
      raise exception 'Jenis poin meeting tidak valid.'
        using errcode = '22023';
    end if;

    if v_item_title = '' then
      raise exception 'Judul setiap poin pembahasan wajib diisi.'
        using errcode = '22023';
    end if;

    if v_kind = 'discussion' then
      v_case_id := null;
    elsif v_kind = 'existing_case' then
      if v_case_id is null then
        raise exception 'Pilih Case yang sudah terdaftar untuk poin: %.', v_item_title
          using errcode = '22023';
      end if;
    elsif v_kind = 'new_case' and v_case_id is null then
      v_project := coalesce(v_item->'project','{}'::jsonb);
      if nullif(trim(coalesce(v_project->>'hub_code','')),'') is null
         or nullif(trim(coalesce(v_project->>'category','')),'') is null
         or nullif(trim(coalesce(v_project->>'division','')),'') is null
         or nullif(trim(coalesce(v_project->>'problem_identification','')),'') is null
         or nullif(v_project->>'occurred_on','') is null then
        raise exception 'Lengkapi HUB, kategori, divisi, tanggal kejadian, dan Problem Identification untuk Case baru: %.', v_item_title
          using errcode = '22023';
      end if;

      v_case_payload := jsonb_build_object(
        'title', v_item_title,
        'hub_code', upper(trim(v_project->>'hub_code')),
        'category', trim(v_project->>'category'),
        'division', trim(v_project->>'division'),
        'problem_identification', trim(v_project->>'problem_identification'),
        'occurred_on', v_project->>'occurred_on',
        'target_date', nullif(v_project->>'target_date',''),
        'reporter', coalesce(nullif(trim(v_project->>'reporter'),''), 'Weekly Meeting'),
        'priority', coalesce(nullif(v_project->>'priority',''),'Medium'),
        'status', 'open'
      );
      v_actions := coalesce(v_project->'actions','[]'::jsonb);
      v_created_case := public.wct_create_case(v_case_payload, v_actions);
      v_case_id := nullif(v_created_case->>'id','')::uuid;

      if v_case_id is null then
        raise exception 'Case baru untuk poin % tidak berhasil dibuat.', v_item_title;
      end if;
    end if;

    if v_case_id is not null then
      select exists(
        select 1 from public.wct_cases where id = v_case_id
      ) into v_case_exists;
      if not v_case_exists then
        raise exception 'Case yang dipilih untuk poin % tidak ditemukan.', v_item_title
          using errcode = 'P0002';
      end if;
    end if;

    if v_item_id is not null then
      update public.wct_meeting_items
      set sort_order = v_order,
          kind = v_kind,
          title = v_item_title,
          summary = v_summary,
          decisions = v_decisions,
          next_step = v_next_step,
          case_id = v_case_id,
          updated_by = v_uid,
          updated_at = now()
      where id = v_item_id
        and meeting_id = v_meeting_id;

      if not found then
        raise exception 'Poin meeting yang akan diperbarui tidak ditemukan.'
          using errcode = 'P0002';
      end if;
    else
      insert into public.wct_meeting_items (
        meeting_id, sort_order, kind, title, summary, decisions,
        next_step, case_id, created_by, updated_by
      ) values (
        v_meeting_id, v_order, v_kind, v_item_title, v_summary, v_decisions,
        v_next_step, v_case_id, v_uid, v_uid
      )
      returning id into v_item_id;
    end if;

    v_saved_ids := array_append(v_saved_ids, v_item_id);
    v_item_id := null;
  end loop;

  delete from public.wct_meeting_items
  where meeting_id = v_meeting_id
    and not (id = any(v_saved_ids));

  select coalesce(
    jsonb_agg(case_id::text order by sort_order),
    '[]'::jsonb
  )
  into v_case_ids
  from public.wct_meeting_items
  where meeting_id = v_meeting_id
    and case_id is not null;

  update public.wct_meetings
  set notes = jsonb_build_object(
        'wct_meeting_payload', 1,
        'summary', '',
        'decisions', '',
        'next_steps', '',
        'case_ids', v_case_ids,
        'hub_code', v_hub_code
      )::text,
      updated_at = now()
  where id = v_meeting_id
  returning * into v_meeting;

  select coalesce(
    jsonb_agg(to_jsonb(mi) order by mi.sort_order),
    '[]'::jsonb
  )
  into v_saved_items
  from public.wct_meeting_items mi
  where mi.meeting_id = v_meeting_id;

  return jsonb_build_object(
    'meeting', to_jsonb(v_meeting),
    'items', v_saved_items,
    'case_ids', v_case_ids
  );
end;
$$;

revoke all on function public.wct_save_meeting_with_items(uuid,jsonb,jsonb) from public, anon;
grant execute on function public.wct_save_meeting_with_items(uuid,jsonb,jsonb) to authenticated;

commit;
