create table if not exists public.lead_status (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null unique references public.leads(id) on delete cascade,
  broker_id uuid not null references public.brokers(id) on delete cascade,
  status text not null check (status in ('Contacted', 'Submitted', 'Lost', 'Not eligible')),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

drop trigger if exists lead_status_set_updated_at on public.lead_status;
create trigger lead_status_set_updated_at
before update on public.lead_status
for each row
execute procedure public.set_updated_at();

create index if not exists lead_status_broker_id_idx on public.lead_status (broker_id);

alter table public.lead_status enable row level security;

drop policy if exists "lead_status_select_own" on public.lead_status;
create policy "lead_status_select_own"
on public.lead_status
for select
using (
  exists (
    select 1
    from public.brokers b
    where b.id = lead_status.broker_id
      and b.auth_user_id = auth.uid()
  )
);

drop policy if exists "lead_status_upsert_own" on public.lead_status;
create policy "lead_status_upsert_own"
on public.lead_status
for all
using (
  exists (
    select 1
    from public.brokers b
    where b.id = lead_status.broker_id
      and b.auth_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.brokers b
    where b.id = lead_status.broker_id
      and b.auth_user_id = auth.uid()
  )
);
