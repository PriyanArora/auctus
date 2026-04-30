-- 0020_rls_funding.sql
-- Funding-side RLS. Depends on 0010_rls_identity.sql (profiles.role is the authority).
-- Reads: authenticated users see only `active` rows whose `type` matches the funding type
--        derived from their `profiles.role`. Anonymous sessions see nothing.
-- Writes on funding/funding_sources/scrape_runs: service role only (no authenticated policy).
-- funding_preferences: read/write own row for the user's current role only.

create or replace function public.funding_type_for_role(p_role text)
returns public.funding_type
language sql
immutable
as $$
  select case p_role
    when 'business' then 'business_grant'::public.funding_type
    when 'student' then 'scholarship'::public.funding_type
    when 'professor' then 'research_grant'::public.funding_type
    else null::public.funding_type
  end;
$$;

alter table public.funding enable row level security;
alter table public.funding_preferences enable row level security;
alter table public.funding_sources enable row level security;
alter table public.scrape_runs enable row level security;

-- funding: authenticated read of active rows whose type matches the caller's role.
drop policy if exists "funding role select" on public.funding;
create policy "funding role select"
on public.funding
for select
to authenticated
using (
  status = 'active'
  and type = public.funding_type_for_role(
    (select role from public.profiles where id = auth.uid())
  )
);

-- funding: writes are service-role only. No authenticated insert/update/delete policy.

-- funding_preferences: own row for the current role only.
drop policy if exists "funding_preferences own row select" on public.funding_preferences;
create policy "funding_preferences own row select"
on public.funding_preferences
for select
to authenticated
using (
  user_id = auth.uid()
  and role = (select role from public.profiles where id = auth.uid())
);

drop policy if exists "funding_preferences own row insert" on public.funding_preferences;
create policy "funding_preferences own row insert"
on public.funding_preferences
for insert
to authenticated
with check (
  user_id = auth.uid()
  and role = (select role from public.profiles where id = auth.uid())
);

drop policy if exists "funding_preferences own row update" on public.funding_preferences;
create policy "funding_preferences own row update"
on public.funding_preferences
for update
to authenticated
using (
  user_id = auth.uid()
  and role = (select role from public.profiles where id = auth.uid())
)
with check (
  user_id = auth.uid()
  and role = (select role from public.profiles where id = auth.uid())
);

drop policy if exists "funding_preferences own row delete" on public.funding_preferences;
create policy "funding_preferences own row delete"
on public.funding_preferences
for delete
to authenticated
using (
  user_id = auth.uid()
  and role = (select role from public.profiles where id = auth.uid())
);

-- funding_sources / scrape_runs: service role only. No policy for authenticated/anon means no rows are returned.
