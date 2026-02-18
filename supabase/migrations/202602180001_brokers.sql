create extension if not exists pgcrypto;

create table if not exists public.brokers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null,
  company_name text,
  phone text not null,
  state_coverage text[] not null,
  specialties text[] not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint brokers_state_coverage_check check (
    cardinality(state_coverage) > 0
    and state_coverage <@ array['VIC', 'NSW']::text[]
  ),
  constraint brokers_specialties_check check (
    cardinality(specialties) > 0
    and specialties <@ array['refinance', 'self_employed']::text[]
  )
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists brokers_set_updated_at on public.brokers;
create trigger brokers_set_updated_at
before update on public.brokers
for each row
execute procedure public.set_updated_at();

alter table public.brokers enable row level security;

drop policy if exists "brokers_select_own" on public.brokers;
create policy "brokers_select_own"
on public.brokers
for select
using (auth.uid() = auth_user_id);

drop policy if exists "brokers_insert_own" on public.brokers;
create policy "brokers_insert_own"
on public.brokers
for insert
with check (auth.uid() = auth_user_id);

drop policy if exists "brokers_update_own" on public.brokers;
create policy "brokers_update_own"
on public.brokers
for update
using (auth.uid() = auth_user_id)
with check (auth.uid() = auth_user_id);
