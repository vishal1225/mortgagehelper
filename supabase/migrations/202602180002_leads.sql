create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  segment text not null check (segment in ('refinance', 'self_employed')),
  state text not null check (state in ('VIC', 'NSW')),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  readiness_score text not null check (readiness_score in ('Green', 'Amber', 'Red')),
  quiz_data jsonb not null default '{}'::jsonb,
  is_unlocked boolean not null default false,
  locked_by_broker_id uuid references public.brokers(id) on delete set null,
  lock_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row
execute procedure public.set_updated_at();

create index if not exists leads_segment_state_idx
  on public.leads (segment, state);

create index if not exists leads_unlock_lookup_idx
  on public.leads (is_unlocked, lock_expires_at);

alter table public.leads enable row level security;

drop policy if exists "leads_insert_public" on public.leads;
create policy "leads_insert_public"
on public.leads
for insert
to anon, authenticated
with check (true);
