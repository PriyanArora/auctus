# Dev A Buildflow — Identity & Community

**Owner: Aaryan**

## Mission

Own everything related to who the user is and how the community runs:

- auth (Supabase + Google OAuth)
- roles (the role enum, role assignment, role gating)
- onboarding
- profiles (`Profile` + `BusinessProfile` + `StudentProfile` + `ProfessorProfile`)
- forum (threads, replies)
- route protection (middleware + combined route policy registry)
- shell composition (root layout, providers, navbar, footer, landing, dashboard composer)

## Working Rule

Stay inside Dev A folders unless you are following a contract change protocol or executing an explicit shared-file PR.

## Off-Limits Folders (do NOT touch)

These belong to Dev B. Any change here requires Dev B's explicit approval on a PR you opened — and almost every time, the right move is to file an issue and let Dev B do it.

```
app/(funding)/grants/**
app/(funding)/scholarships/**
app/(funding)/research-funding/**
components/funding/**            ← exception: import only, never edit
lib/funding/**                   ← exception: import the published exports, never edit
lib/matching/**
scraper/**
supabase/migrations/0003_*.sql, 0004_*.sql, 0011_*.sql, 0020-0029
.github/workflows/scrape.yml
```

Demo folders (`app/(demo)/**`, `components/demo/**`, `lib/demo/**`, `data/demo/**`) are Dev A's *only* during the V2.P1 surgery PR. After that PR merges, demo is frozen — neither dev edits it.

## Owned Folders

```
app/(identity)/sign-in/**, sign-out/**, auth/callback/**
app/onboarding/**
app/profile/**
app/forum/**
app/dashboard/**
app/page.tsx
app/layout.tsx
app/providers.tsx
app/globals.css        ← shared but Dev A is owner of last resort
middleware.ts
components/auth/**
components/profile/**
components/forum/**
components/layout/**
lib/auth/**
lib/profile/**
lib/forum/**
lib/session/**
lib/env.ts             ← shared but Dev A maintains
supabase/migrations/0001_profiles.sql
supabase/migrations/0002_forum.sql
supabase/migrations/0010_rls_identity.sql
.github/workflows/ci.yml
```

## Contracts Dev A Publishes

- `build/contracts/role.ts` (LOCKED by V2.P1)
- `build/contracts/profile.ts` (LOCKED by V2.P1)
- `build/contracts/session.ts` (LOCKED by V2.P1)
- `build/contracts/route-policy.ts` (LOCKED by V2.P1)
- Runtime: `lib/session/get-session.ts` exports `GetSession` (server) and `useSession` (client).
- Runtime: `lib/auth/route-policies.ts` exports the merged `RoutePolicyRegistry` (its own + Dev B's).

## Contracts Dev A Consumes

- `build/contracts/funding.ts` — for dashboard tile and any landing teaser.
- Runtime: `lib/funding/queries.ts` `GetFundingSummariesForUser` (consumed in V2.P4 only).
- Runtime: `lib/funding/route-policies.ts` (imported by `lib/auth/route-policies.ts` to compose the merged registry).

---

## Step 0 — Shared Bootstrap (V2.P1)

Dev A is the bootstrap executor. Follow `build/shared/bootstrap.md` end-to-end.

Key items Dev A personally drives:

- A1 mixed-file surgery PR (single PR, Dev B reviews).
- A2 `@contracts/*` path alias.
- B1-B4 Supabase project, `.env.example`, `lib/env.ts`, `supabase/migrations/0000_init.sql`.
- C1, C2 Vitest + CI workflow.
- D2 promote `Profile`, `Session`, `Funding` contracts to LOCKED with Dev B.

**Tests for V2.P1:** `npm run lint`, `npm run build`, `npm test`, CI green on a PR.

**Proof for V2.P1:** every box in `bootstrap.md` "V2.P1 Completion Gate" is ticked.

---

## Step 1 — Identity Foundation (V2.P2)

### Coupling

- **Inbound:** none. This step is fully independent.
- **Outbound to Dev B:** publishes the runtime `GetSession` (server) and `useSession` (client) per the LOCKED `Session` shape. Publishes the merged `RoutePolicyRegistry` mechanism so Dev B can register funding routes.

### Tasks

1. Add `lib/env.ts` env-guarded reads of all Supabase vars (already from bootstrap; reuse).
2. Create `lib/supabase/client.ts` (browser, anon key) and `lib/supabase/server.ts` (server-side cookie-based client via `@supabase/ssr`).
3. Create `app/(identity)/sign-in/page.tsx` — "Sign in with Google" button.
4. Create `app/auth/callback/route.ts` — exchange code, redirect to `/onboarding` on first login (no profile row) or `/dashboard` (profile exists).
5. Create `app/(identity)/sign-out/route.ts` — POST sign-out.
6. Create `lib/session/get-session.ts` — server-side `GetSession`. Reads Supabase session, joins `profiles` for `role`, returns `Session | null` per the LOCKED `Session` contract.
7. Create `lib/session/use-session.ts` — client-side `useSession` hook with the same shape.
8. Create `lib/auth/route-policies.ts` — exports the empty initial `RoutePolicyRegistry` plus `combineRegistries(...registries)`.
9. Create `middleware.ts` — uses `combineRegistries(authPolicies, await import('@/lib/funding/route-policies'))`. If Dev B's file does not yet exist, fall back to an empty array (do NOT crash the app). Apply the most-specific-prefix-wins gate logic against the request URL.

### Migrations

- `supabase/migrations/0001_profiles.sql`:
  - `profiles` table (id uuid PK references `auth.users`, role text NOT NULL CHECK in role enum, display_name, email, avatar_url, created_at, updated_at).
  - Trigger to upsert `profiles` row on `auth.users` insert.

### Outputs / Deliverables

- `GetSession` runtime export — Dev B can import it.
- Empty merged `RoutePolicyRegistry` — Dev B can register entries against it.
- A user can complete the sign-in round-trip and end up with a `profiles` row.

### Tests

- Vitest: `lib/session/get-session.test.ts` mocks Supabase and asserts shape conforms to `Session`.
- Manual: sign-in flow tested against the real Supabase project; profile row appears.

### Proof for completion

- [ ] Sign in with Google works end-to-end on a fresh browser.
- [ ] `profiles` row created automatically on first sign-in.
- [ ] `GetSession()` returns `{ user_id, role }` (role can be a default sentinel for now if onboarding not yet built — see Step 2).
- [ ] `middleware.ts` handles unknown route gracefully (does not crash if Dev B has not registered yet).
- [ ] Build, lint, test green.
- [ ] Commit: `feat(auth): add Supabase Google OAuth and session contract`

---

## Step 2 — Role Selection & Onboarding (V2.P2 → V2.P3)

### Coupling

- **Inbound:** confirmation from Dev B that `Session.role: Role | null` is acceptable (already pre-locked in `build/contracts/session.ts` during V2.P1; verify in passing).
- **Outbound to Dev B:** publishes `lib/profile/queries.ts` exporting `getRoleProfile(user_id) => Promise<RoleProfile | null>`. This is what Dev B's matching needs in Step 3.

### Tasks

1. Update `0001_profiles.sql` migration — `role` column allows nullable initially OR add a `0001a_profiles_pending_role.sql` migration introducing `pending` sentinel. Decision: nullable role, with check constraint `role IS NULL OR role IN ('business','student','professor')`. Update `Session` contract usage so Dev B sees `role: Role | null` — **this requires a contract change protocol PR before locking V2.P1, or pre-bake the nullable into the V2.P1 contract lock**.
   - Coordinate with Dev B during V2.P1 D2 lock: lock `Session.role` as `Role | null` to handle the onboarding gap. Update `build/contracts/session.ts` accordingly.
2. Create `app/onboarding/page.tsx` — role selector form.
3. Create `app/onboarding/[role]/page.tsx` — per-role profile form (business / student / professor).
4. Create `lib/profile/upsert.ts` — server actions to upsert `profiles` and the role-specific table.
5. Wire callback redirect: `null` role → `/onboarding`; non-null role → `/dashboard`.

### Migrations

- `supabase/migrations/0001_profiles.sql` (already created in Step 1) — extend with nullable role + per-role tables, OR split:
  - `0001_profiles.sql` — base table only.
  - `0002_role_profiles.sql` — `business_profiles`, `student_profiles`, `professor_profiles`.
- `supabase/migrations/0010_rls_identity.sql` — RLS: users read/edit only their own profile rows.

### Tests

- Vitest: `lib/profile/upsert.test.ts` — happy path + invalid role + already-onboarded.
- Manual: sign-in → onboarding → land on `/dashboard`.

### Proof for completion

- [ ] User picks a role, fills profile, profile rows persist.
- [ ] Returning user skips onboarding and lands on `/dashboard`.
- [ ] RLS verified: querying another user's profile rows returns nothing.
- [ ] Commit: `feat(profile): add per-role onboarding and profile persistence`

---

## Step 3 — Forum Domain (V2.P3)

### Coupling

- **Inbound:** none.
- **Outbound to Dev B:** none.

### Tasks

1. `app/forum/page.tsx` — list threads, sort by recency.
2. `app/forum/[threadId]/page.tsx` — thread + replies + new reply form.
3. `app/forum/new/page.tsx` — new thread form.
4. `lib/forum/queries.ts` — `listThreads`, `getThread`, `createThread`, `createReply`, `markReplyHelpful`.
5. `components/forum/ThreadCard.tsx`, `ReplyCard.tsx` (move from `components/demo/` per surgery — already done in V2.P1; adapt to real data).
6. Show `Profile.role` as a badge on author.

### Migrations

- `supabase/migrations/0002_forum.sql` — `threads`, `replies`. (May be merged with profiles migration if numbering warrants.)
- `supabase/migrations/0010_rls_identity.sql` extended to forum tables: anyone authenticated reads, only author edits.

### Tests

- Vitest: forum query helpers (mocked Supabase).
- Manual: post thread → reply → both visible after reload.

### Proof for completion

- [ ] Thread persists, reply persists, reload shows them.
- [ ] Author role badge renders.
- [ ] RLS verified on edit attempt by another user.
- [ ] Commit: `feat(forum): add persisted threads and replies`

---

## Step 4 — Shell & Navigation (V2.P3)

### Coupling

- **Inbound:** consumes only the LOCKED `Role` enum + `ROLE_DEFAULT_ROUTE` from `build/contracts/role.ts`. No runtime dependency on Dev B.
- **Outbound to Dev B:** none.

### Tasks

1. Update `components/layout/Navbar.tsx` to be role-aware: signed-out → public CTAs; signed-in → role's funding link from `ROLE_DEFAULT_ROUTE`, profile, forum, dashboard.
2. Update `app/page.tsx` (landing) — signed-in users redirect to `/dashboard`; signed-out shows role-targeted CTAs.
3. Update `app/layout.tsx` — wrap with `<Providers>` (auth + toast contexts).
4. Update `app/providers.tsx` — add the auth context using `useSession` from Step 1.

### Tests

- Manual: signed-out user sees public landing; signed-in user redirected to dashboard; navbar shows role-correct funding link.

### Proof for completion

- [ ] Three role accounts each see correct navbar link.
- [ ] Sign-out returns user to public landing.
- [ ] Commit: `feat(shell): add role-aware navbar and landing redirect`

---

## Step 5 — Integration Consumption (V2.P4)

### Coupling (this is the heavy one)

- **Inbound from Dev B:** `lib/funding/queries.ts` exports `GetFundingSummariesForUser(user_id, limit)` returning `FundingSummary[]` with real ETL data. `components/funding/FundingSummaryTile.tsx` exported as a presentation component taking `summaries: FundingSummary[]`.
- **Inbound trigger:** Dev B has logged in their `progress.md` "Contract changes consumed" section that funding queries are stable on `main` against real ETL data. Do NOT start Step 5 before this entry exists.
- **Outbound to Dev B:** none. The composition lives entirely in Dev A's `app/dashboard/page.tsx`.

### Tasks

1. Wait for Dev B to confirm `GetFundingSummariesForUser` stable on `main` against real ETL data.
2. `app/dashboard/page.tsx` composes:
   - Profile summary tile (own data).
   - Funding summary tile — `await GetFundingSummariesForUser(session.user_id, 5)` rendered with `components/funding/FundingSummaryTile.tsx` (lives in Dev B's `components/funding/` — Dev B publishes it as part of the funding-summary deliverable; Dev A imports only).
   - Forum activity tile (own data).
3. If a landing teaser is desired, also call `GetFundingSummariesForUser` on `app/page.tsx` for unauthenticated visitors with a default role (Dev A picks a sentinel; if not desired, skip).

### Tests

- Manual: dashboard renders with real funding tiles for each role.
- Vitest: dashboard server component test mocking `GetFundingSummariesForUser`.

### Proof for completion

- [ ] Three role accounts each see role-appropriate funding tiles on dashboard.
- [ ] Commit: `feat(dashboard): integrate funding summaries`

---

## Step 6 — Hardening (V2.P5)

### Coupling

- **Inbound:** none.
- **Outbound to Dev B:** none. Each dev hardens their own surface independently.

### Tasks

1. Audit Dev A owned files for any imports from `lib/demo/` or `components/demo/`. Remove all.
2. Add Vitest coverage for: sign-in callback, onboarding upsert, forum CRUD, dashboard composer.
3. Add Playwright (optional, if added to bootstrap): sign-in → onboarding → post-thread happy path.
4. Update README with Dev A's flows.

### Proof for completion

- [ ] Zero `from "@/lib/demo"` or `from "@/components/demo"` in Dev A files.
- [ ] All Vitest suites green.
- [ ] Commit: `chore(hardening): remove demo imports and add identity tests`

---

## Done Criteria for Dev A's Track

- Users sign in via Google and hold one of the 3 roles.
- Onboarding completes and writes per-role profile data.
- Returning users land on the correct role-aware experience.
- Route protection works (other-role and unauthenticated access blocked).
- Forum threads and replies persist.
- Role-aware shell + landing redirect work.
- Dev B can consume `Role`, `Profile`, `Session`, `RoutePolicy` without ambiguity.

## When You Are Blocked

Check `build/shared/conventions.md` "When you are blocked" first. Allowed blockers list is in `build/shared/ownership.md` "Blocking Policy."

Most likely real blocker for Dev A: none in V2.P2-P3. Dev A's track has no upstream dependency on Dev B until V2.P4 dashboard integration. If you find yourself waiting on Dev B before V2.P4, you have the wrong blocker — pick another step.
