create or replace function public.get_matching_lead_previews(p_limit integer default 50)
returns table (
  id uuid,
  segment text,
  state text,
  readiness_score text,
  quiz_data jsonb,
  created_at timestamptz,
  is_unlocked boolean,
  locked_by_broker_id uuid,
  lock_expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_broker_id uuid;
  v_states text[];
  v_specialties text[];
  v_limit integer;
begin
  select b.id, b.state_coverage, b.specialties
  into v_broker_id, v_states, v_specialties
  from public.brokers b
  where b.auth_user_id = auth.uid()
  limit 1;

  if v_broker_id is null then
    return;
  end if;

  v_limit := greatest(1, least(coalesce(p_limit, 50), 200));

  return query
  select
    l.id,
    l.segment,
    l.state,
    l.readiness_score,
    l.quiz_data,
    l.created_at,
    l.is_unlocked,
    l.locked_by_broker_id,
    l.lock_expires_at
  from public.leads l
  where l.is_unlocked = false
    and l.state = any(v_states)
    and l.segment = any(v_specialties)
  order by l.created_at desc
  limit v_limit;
end;
$$;

revoke all on function public.get_matching_lead_previews(integer) from public;
grant execute on function public.get_matching_lead_previews(integer) to authenticated;
