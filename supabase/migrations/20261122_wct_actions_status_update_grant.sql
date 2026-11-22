-- Allow authenticated clients to move Actions between Tasks columns.
-- RLS remains the row-level gate: only active Admin/Coordinator profiles
-- pass public.wct_actions_lead_update via private.wct_is_lead().
-- Only the three fields used by the drag-and-drop status action are granted.
grant update (status, updated_at, updated_by)
on table public.wct_actions
to authenticated;
