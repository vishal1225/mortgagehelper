create table if not exists public.unlocks (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null unique references public.leads(id) on delete cascade,
  broker_id uuid not null references public.brokers(id) on delete cascade,
  stripe_checkout_session_id text not null unique,
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'aud',
  paid_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists unlocks_broker_id_idx on public.unlocks (broker_id);

alter table public.unlocks enable row level security;

create or replace function public.complete_lead_unlock(
  p_lead_id uuid,
  p_broker_id uuid,
  p_stripe_checkout_session_id text,
  p_amount_cents integer,
  p_currency text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lead_is_unlocked boolean;
  v_locked_by_broker_id uuid;
  v_lock_expires_at timestamptz;
begin
  if exists (
    select 1
    from public.unlocks
    where stripe_checkout_session_id = p_stripe_checkout_session_id
  ) then
    return true;
  end if;

  select is_unlocked, locked_by_broker_id, lock_expires_at
  into v_lead_is_unlocked, v_locked_by_broker_id, v_lock_expires_at
  from public.leads
  where id = p_lead_id
  for update;

  if not found then
    return false;
  end if;

  if v_lead_is_unlocked then
    return false;
  end if;

  if v_locked_by_broker_id is distinct from p_broker_id then
    return false;
  end if;

  if v_lock_expires_at is null or v_lock_expires_at < now() then
    return false;
  end if;

  insert into public.unlocks (
    lead_id,
    broker_id,
    stripe_checkout_session_id,
    amount_cents,
    currency,
    paid_at
  )
  values (
    p_lead_id,
    p_broker_id,
    p_stripe_checkout_session_id,
    p_amount_cents,
    lower(coalesce(p_currency, 'aud')),
    now()
  );

  update public.leads
  set
    is_unlocked = true,
    locked_by_broker_id = p_broker_id,
    lock_expires_at = null,
    updated_at = now()
  where id = p_lead_id;

  return true;
exception
  when unique_violation then
    return true;
end;
$$;
