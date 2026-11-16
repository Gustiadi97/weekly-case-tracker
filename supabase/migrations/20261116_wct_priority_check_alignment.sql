-- Weekly Case Tracker: align the Case priority constraint with the form values.
-- The UI uses High / Medium / Low. This migration compares case-insensitively
-- and preserves any distinct, non-NULL priority values already present.
-- No Case rows are updated or deleted.

begin;

do $migration$
declare
  v_allowed_values text;
begin
  select string_agg(quote_literal(value), ', ' order by value)
    into v_allowed_values
  from (
    select distinct lower(btrim(priority)) as value
    from public.wct_cases
    where priority is not null

    union
    select 'high'

    union
    select 'medium'

    union
    select 'low'
  ) allowed;

  alter table public.wct_cases
    drop constraint if exists wct_cases_priority_check;

  execute format(
    'alter table public.wct_cases
       add constraint wct_cases_priority_check
       check (
         priority is null
         or lower(btrim(priority)) in (%s)
       )',
    v_allowed_values
  );
end
$migration$;

commit;

-- Verification: should show the revised check expression.
select
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
from pg_constraint
where conrelid = 'public.wct_cases'::regclass
  and conname = 'wct_cases_priority_check';

-- Verification: existing priority values remain untouched.
select priority, count(*) as total
from public.wct_cases
group by priority
order by priority;
