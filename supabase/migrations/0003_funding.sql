do $$
begin
  create type public.funding_type as enum (
    'business_grant',
    'scholarship',
    'research_grant'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.funding_status as enum ('active', 'expired', 'archived');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.funding_source as enum ('scraped', 'manual');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.funding (
  id uuid primary key default gen_random_uuid(),
  type public.funding_type not null,
  name text not null,
  description text,
  provider text not null,
  amount_min numeric,
  amount_max numeric,
  deadline date,
  application_url text,
  source_url text,
  eligibility jsonb not null default '{}'::jsonb,
  requirements text[] not null default '{}',
  category text,
  tags text[] not null default '{}',
  source public.funding_source not null default 'manual',
  scraped_from text,
  scraped_at timestamptz,
  status public.funding_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists funding_type_status_deadline_idx
on public.funding (type, status, deadline);

create index if not exists funding_type_status_created_idx
on public.funding (type, status, created_at desc);

drop trigger if exists funding_set_updated_at on public.funding;
create trigger funding_set_updated_at
before update on public.funding
for each row execute function public.set_updated_at();

create table if not exists public.funding_preferences (
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('business', 'student', 'professor')),
  default_filters jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, role)
);

drop trigger if exists funding_preferences_set_updated_at on public.funding_preferences;
create trigger funding_preferences_set_updated_at
before update on public.funding_preferences
for each row execute function public.set_updated_at();
