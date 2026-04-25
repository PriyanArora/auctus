# Dev B Buildflow — Funding & Pipelines

**Owner: Priyan**

## Mission

Own the funding pipeline end-to-end:

- unified funding domain (one `funding` table, three role views)
- per-role matching algorithms
- ETL: scrapers, normalize, dedupe, expire, upsert
- role-aware funding visibility (RLS + query filters)

## Working Rule

Stay inside Dev B folders unless you are following a contract change protocol or executing an explicit shared-file PR.

## Off-Limits Folders (do NOT touch)

These belong to Dev A. Any change here requires Dev A's explicit approval on a PR you opened — and almost every time, the right move is to file an issue and let Dev A do it.

```
app/(identity)/**
app/onboarding/**
app/profile/**
app/forum/**
app/dashboard/**
app/page.tsx
app/layout.tsx
app/providers.tsx
app/globals.css                  ← shared, but Dev A is owner of last resort
middleware.ts
components/auth/**
components/profile/**
components/forum/**
components/layout/**
lib/auth/**
lib/profile/**                   ← exception: import only (e.g. getRoleProfile), never edit
lib/forum/**
lib/session/**                   ← exception: import only (GetSession, useSession), never edit
lib/env.ts                       ← exception: read only
supabase/migrations/0001_*.sql, 0002_*.sql, 0010_*.sql (and 0010-0019 range)
.github/workflows/ci.yml
```

Demo folders are frozen for both devs after the V2.P1 surgery PR; do not touch them.

## Owned Folders

```
app/(funding)/grants/**
app/(funding)/scholarships/**
app/(funding)/research-funding/**
components/funding/**
lib/funding/**
lib/matching/**
scraper/**
supabase/migrations/0003_funding.sql
supabase/migrations/0004_scrape_metadata.sql
supabase/migrations/0011_rls_funding.sql (and 0020-range RLS)
.github/workflows/scrape.yml
```

## Contracts Dev B Publishes

- `build/contracts/funding.ts` (LOCKED by V2.P1)
- Runtime: `lib/funding/queries.ts` exporting:
  - `ListFundingForRole: (query: FundingQuery) => Promise<FundingItem[]>`
  - `GetFundingById: (id: string) => Promise<FundingItem | null>`
  - `GetFundingSummariesForUser: (user_id: string, limit?: number) => Promise<FundingSummary[]>`
- Runtime: `lib/funding/route-policies.ts` exporting a `RoutePolicyRegistry` with funding routes.
- Runtime: `components/funding/FundingSummaryTile.tsx` — Dev A imports this for dashboard tiles.

## Contracts Dev B Consumes

- `build/contracts/role.ts` — for `Role`, `ROLES`, `ROLE_DEFAULT_ROUTE`.
- `build/contracts/profile.ts` — `Profile`, `RoleProfile` for matching algorithms.
- `build/contracts/session.ts` — `GetSession`, `useSession` for role-aware visibility.
- `build/contracts/route-policy.ts` — `RoutePolicy` shape.

---

## Step 0 — Shared Bootstrap (V2.P1)

Most bootstrap is owned by Dev A. Dev B's required contributions:

- **B5** Scraper workspace skeleton (`scraper/` with own `package.json`, `tsconfig.json`, `index.ts`).
- **C3** Scrape workflow stub (`.github/workflows/scrape.yml` with manual trigger).
- **D2** Lock the `funding.ts` contract with Dev A's review.
- Review the surgery PR (A1) and the supabase-js install PR (B2).

Do NOT start writing funding code in V2.P1. Use this phase to:

- Read and internalize `build/contracts/`.
- Sketch the `funding` table schema in a draft `0003_funding.sql` (do not commit until V2.P2).
- Draft 2-3 source-page reconnaissance notes (e.g., NSERC scholarship listing) — kept local, not committed.

**Tests for V2.P1:** `cd scraper && npx tsx index.ts` prints the bootstrap line; manual `workflow_dispatch` of `scrape.yml` succeeds.

**Proof for V2.P1:** Dev B's bootstrap items in `bootstrap.md` ticked; `funding.ts` LOCKED.

---

## Step 1 — Funding Domain Foundation (V2.P2)

### Coupling

- **Inbound:** consumes only LOCKED contracts (`Role`, `RoutePolicy`, `Session`). No runtime dependency on Dev A in this step.
- **Outbound to Dev A:** publishes `lib/funding/route-policies.ts` exporting a `RoutePolicyRegistry`. Dev A's `lib/auth/route-policies.ts` imports and concatenates it. If Dev A's registry is not yet importing yours, the funding routes still render (they just are not gated yet — that is Dev A's wiring job, not yours).

### Tasks

1. `supabase/migrations/0003_funding.sql`:
   - `funding` table per `FundingItem` shape (use enum types for `type`, `status`, `source`).
   - Indexes: `(type, status, deadline)`, `(type, status, created_at desc)`.
   - Trigger: `updated_at = now()` on update.
2. Seed 5-10 manual rows per type via a `supabase/seeds/funding_seed.sql` (committed).
3. `lib/funding/supabase.ts` — internal client (server-side, anon for queries that respect RLS once it lands; service-role for ingestion in `scraper/`).
4. `lib/funding/queries.ts` — implement `ListFundingForRole`, `GetFundingById`, `GetFundingSummariesForUser` against the seeded table. `GetFundingSummariesForUser` initially ignores user-specific scoring and returns the most recent N items for the user's role; matching wires in Step 3.
5. `lib/funding/role-mapping.ts` — `roleToFundingType: Record<Role, FundingType>`.
6. `lib/funding/route-policies.ts` — register `/grants` (business), `/scholarships` (student), `/research-funding` (professor).

### Tests

- Vitest: `lib/funding/queries.test.ts` against a Supabase test instance (or pglite if added). Asserts return shape matches `FundingItem` / `FundingSummary`.
- Vitest: `lib/funding/role-mapping.test.ts` covers all three roles.

### Proof for completion

- [ ] `funding` table exists with seed rows of all three types.
- [ ] Calling `ListFundingForRole({ role: 'student' })` from a Vitest test returns only `scholarship` rows.
- [ ] `lib/funding/route-policies.ts` exports a registry that `middleware.ts` (Dev A) picks up after a fresh build.
- [ ] Commit: `feat(funding): add unified funding table and query helpers`

---

## Step 2 — Funding Pages (V2.P2)

### Coupling

- **Inbound from Dev A (soft):** `GetSession()` from `lib/session/get-session.ts` is convenient for asserting the user's role server-side. If Dev A has not published it yet, fall back to a sentinel role per route (e.g., `app/(funding)/grants/page.tsx` assumes `business`); middleware will eventually enforce. Do not block on this.
- **Outbound to Dev A:** publishes `components/funding/FundingSummaryTile.tsx` for Dev A's dashboard. Pure presentation; takes `summaries: FundingSummary[]` prop.

### Tasks

1. `app/(funding)/grants/page.tsx` — server component. Calls `GetSession()`, asserts `role === 'business'` (middleware also enforces). Fetches via `ListFundingForRole({ role: 'business' })`. Renders `<FundingList items={...} />`.
2. `app/(funding)/scholarships/page.tsx` — same shape, role student.
3. `app/(funding)/research-funding/page.tsx` — same shape, role professor.
4. `app/(funding)/grants/[id]/page.tsx`, `scholarships/[id]/page.tsx`, `research-funding/[id]/page.tsx` — detail pages calling `GetFundingById`.
5. `components/funding/FundingList.tsx`, `FundingCard.tsx`, `FundingDetail.tsx`, `FundingFilters.tsx`.
6. `components/funding/FundingSummaryTile.tsx` — Dev A imports this for the dashboard. Takes `summaries: FundingSummary[]` prop. Pure presentation.

### Tests

- Vitest: `FundingCard` snapshot against a fixture `FundingItem`.
- Manual: each role's listing page renders seeded rows.

### Proof for completion

- [ ] `/grants`, `/scholarships`, `/research-funding` render seed rows.
- [ ] Detail pages render eligibility breakdown.
- [ ] `<FundingSummaryTile>` renders correctly given a fixture.
- [ ] Commit: `feat(funding): add role-aware listing and detail pages`

---

## Step 3 — Matching (V2.P3)

### Coupling (real dependency)

- **Inbound from Dev A:** `lib/profile/queries.ts` exports `getRoleProfile(user_id) => Promise<RoleProfile | null>`. This is the runtime helper that returns the LOCKED `RoleProfile` shape for a real user. Block on this if it is not published yet — log under "Blockers" with name `getRoleProfile`.
- **Workaround if blocked:** implement and unit-test `lib/matching/{business,student,professor}.ts` against `RoleProfile` fixtures (the LOCKED contract is enough to do that). Only `GetFundingSummariesForUser`'s wiring needs the runtime helper.
- **Outbound to Dev A:** none in this step. Dev A consumes the wired `GetFundingSummariesForUser` only in V2.P4 (see Step 6).

### Tasks

1. `lib/matching/business.ts` — `scoreBusinessGrant(profile: BusinessProfile, item: FundingItem): number` per ProjectSummary weights (location 25, revenue 25, employees 20, industry 30).
2. `lib/matching/student.ts` — `scoreScholarship(profile: StudentProfile, item: FundingItem): number` (education 30, field 25, province 15, GPA 15, citizenship 15).
3. `lib/matching/professor.ts` — `scoreResearchGrant(profile: ProfessorProfile, item: FundingItem): number` (research area 30, career stage 25, council 20, institution 15, past funding 10).
4. `lib/matching/index.ts` — `scoreFor(roleProfile: RoleProfile, item: FundingItem): number` dispatch.
5. Update `GetFundingSummariesForUser` to:
   - `GetSession()` → `user_id` → fetch `RoleProfile` (call into Dev A's `lib/profile/queries.ts` `getRoleProfile(user_id)` — Dev A publishes this).
   - Score every active item of the role's funding type, return top N as `FundingSummary` with `match_score`.
6. Update `ListFundingForRole` to optionally include `match_score` when called server-side with a session.

### Real Dependency

- `Profile` / `RoleProfile` LOCKED contract — already locked in V2.P1.
- Runtime `lib/profile/queries.ts` `getRoleProfile` from Dev A — true dependency. Coordinate publish in V2.P3.

### Tests

- Vitest: each `score*` function with fixtures (perfect match, partial, no match).
- Vitest: `scoreFor` dispatch happy path per role.
- Manual: pick a seeded business → matching ordering plausible.

### Proof for completion

- [ ] Three matching functions return scores 0-100 against fixtures.
- [ ] `GetFundingSummariesForUser` returns scored summaries for a real test user.
- [ ] Commit: `feat(matching): add per-role match scoring`

---

## Step 4 — ETL & Ingestion (V2.P3)

### Coupling

- **Inbound:** none. Scraper runs on its own GitHub Actions workflow with the Supabase service-role key.
- **Outbound to Dev A:** none directly. Dev A's dashboard consumes the funding rows produced here, but only via the published query helpers in V2.P4.

### Tasks

1. `scraper/types.ts` — `ScrapedFunding`, `Scraper` interfaces (matching ProjectSummary).
2. `scraper/utils.ts` — `parseAmount`, `parseDate`, `cleanText`.
3. `scraper/sources/business/`, `scraper/sources/student/`, `scraper/sources/professor/` — implement **2 sources per role for V2 (6 total)**. Each source is a module exporting a `Scraper` impl using `cheerio`. Design the `Scraper` interface and the per-role source folders so additional sources can be added later by dropping a new module into the right folder and registering it in `scraper/index.ts` — no other code change required. The remaining sources (toward the eventual 5 per role / 15 total) are deferred but not removed from the roadmap.
4. `scraper/normalize.ts` — `ScrapedFunding → FundingItem` (sets `source: 'scraped'`, `scraped_from`, `scraped_at`, `status: 'active'`).
5. `scraper/deduplicate.ts` — match by `(name, provider, type)`. INSERT new, UPDATE changed, skip same.
6. `scraper/expire.ts` — `UPDATE funding SET status='expired' WHERE deadline < now() AND status='active'`.
7. `scraper/index.ts` — register all scrapers in a single `SOURCES` array per role; invoke, normalize, dedupe, expire, log per-source counts. Per-source failure does not stop other scrapers. Adding a new source = add to the array; no orchestrator edits.
8. `supabase/migrations/0004_scrape_metadata.sql` — `funding_sources`, `scrape_runs` tables for run tracking.
9. Update `.github/workflows/scrape.yml` — uncomment cron `0 3 * * *`, add Supabase service key from secrets.

### Tests

- Vitest in `scraper/`: each `Scraper` impl against a fixture HTML file under `scraper/__fixtures__/`.
- Vitest: `dedupe` against a fixture DB (or mocked Supabase client) covering insert/update/skip.
- Manual: trigger workflow from GitHub UI, confirm `scrape_runs` row appears with non-zero count.

### Proof for completion

- [ ] Exactly 2 scrapers per role (6 total) implemented and tested against fixture HTML.
- [ ] Adding a 3rd source for any role requires only: a new file under `scraper/sources/<role>/` and one line in the `SOURCES` array. Demonstrate by adding a no-op stub source, running, then removing it.
- [ ] Manual workflow run produces ≥ 1 new row per source on a clean DB.
- [ ] Cron schedule live.
- [ ] Commit: `feat(scraper): add ETL pipeline with dedupe and expiry`

---

## Step 5 — Funding RLS (V2.P3)

### Coupling (real dependency)

- **Inbound from Dev A:** `supabase/migrations/0010_rls_identity.sql` applied to the shared dev DB. Without it, the `profiles.role` join your RLS reads from is unreliable. Block on this — log under "Blockers" with name `0010_rls_identity.sql`.
- **Workaround if blocked:** stage the policy SQL locally; do not apply to shared DB until 0010 lands.
- **Outbound to Dev A:** none.

### Tasks

1. `supabase/migrations/0011_rls_funding.sql` (or in 0020 range) — RLS policies:
   - SELECT on `funding`: `status='active'` AND `type` matches `(SELECT role FROM profiles WHERE id = auth.uid())` mapped via `roleToFundingType`. Anonymous = no rows.
   - INSERT/UPDATE/DELETE on `funding`: service role only.
2. Verify Dev A's identity-side RLS is landed first (allowed blocker per `ownership.md`).
3. Run integration test: Vitest with two test users of different roles, assert each only sees their type.

### Proof for completion

- [ ] Cross-role query returns nothing.
- [ ] Anonymous query returns nothing.
- [ ] Service role still ingests via scraper.
- [ ] Commit: `feat(funding): add RLS for role-aware visibility`

---

## Step 6 — Integration Publishing (V2.P4)

### Coupling (this is the heavy one)

- **Inbound:** none — your work is already done; you are publishing.
- **Outbound to Dev A:** confirm in Dev A's `progress.md` "Contract changes consumed" section: `lib/funding/queries.ts` exports stable on `main` against real ETL data as of `<commit hash>`. This is the trigger Dev A waits for to start their Step 5 dashboard tile.

### Tasks

1. Confirm `funding.ts` and all runtime exports are stable on `main` against real ETL data.
2. Notify Dev A in their progress.md "Contract changes consumed" section: "FundingSummary scored against real ETL data, stable on main as of <commit>."
3. Pair with Dev A on the dashboard tile PR — review only; do NOT edit `app/dashboard/**`.

### Proof for completion

- [ ] Dev A's dashboard tile renders Dev B's data without changes to the contract.
- [ ] Commit: `docs(funding): confirm contracts stable for integration`

---

## Step 7 — Hardening (V2.P5)

### Coupling

- **Inbound:** none.
- **Outbound to Dev A:** none. Each dev hardens their own surface independently.

### Tasks

1. Audit Dev B owned files for any imports from `lib/demo/` or `components/demo/`. Remove all.
2. Add data-quality test in `scraper/`: no row with `amount_min > amount_max`; no `status='active'` row with past deadline.
3. README in `scraper/` covers env, run, expected output.
4. End-to-end test (Vitest or Playwright if added): seeded user → loads listing → filter → detail.

### Proof for completion

- [ ] Zero demo imports in Dev B files.
- [ ] All data-quality assertions green on the live dev DB.
- [ ] Commit: `chore(hardening): remove demo imports and add funding tests`

---

## Done Criteria for Dev B's Track

- Funding listing and detail work for business, student, professor.
- Per-role matching scores correctly using LOCKED profile shape.
- ETL produces clean ingestible funding data daily.
- RLS blocks cross-role and unauthenticated access.
- Dev A consumes `FundingItem`, `FundingQuery`, `FundingSummary`, `ListFundingForRole`, `GetFundingById`, `GetFundingSummariesForUser`, `FundingSummaryTile` without ambiguity.

## When You Are Blocked

Check `build/shared/conventions.md` "When you are blocked." Allowed blockers:

- Identity-side RLS (`0010_*`) not landed → blocks Step 5 funding RLS.
- `Profile` / `RoleProfile` not LOCKED → would block Step 3 matching, but those are LOCKED in V2.P1 already.
- `getRoleProfile` runtime helper from Dev A not published → blocks Step 3 wiring `GetFundingSummariesForUser` to scoring.

If you hit any of these, log in `progress.md` "Blockers" with the named missing deliverable. Otherwise pick another step in this track that has no upstream dependency.
