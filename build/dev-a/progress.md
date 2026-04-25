# Dev A Progress — Aaryan

Mirror of `build/dev-a/buildflow.md`. Update each box as it passes its proof line. A step is `[x]` only when **proof** is shown, not when code is written.

**Owner:** Aaryan
**Domain:** identity & community (auth, roles, onboarding, profiles, forum, route protection, shell, dashboard composition)

## Current Phase

V2.P1 — Shared Bootstrap & Restructuring (not started)

## Contract Changes Consumed

(One line per locked-contract change Dev A consumed. Initially empty.)

---

## Step 0 — Shared Bootstrap (V2.P1)

Drives `build/shared/bootstrap.md`. Each box matches the bootstrap completion gate.

- [ ] **A1** — mixed-file surgery PR merged; `/(demo)/...` URLs reachable; build green.
- [ ] **A2** — `@contracts/*` import resolves in a throwaway `lib/_check.ts`.
- [ ] **A3** — `BusinessContext` converted to `.tsx` (optional; can defer).
- [ ] **B1** — Supabase project provisioned; `.env.example` complete; both devs verified `npm run dev` boots locally.
- [ ] **B2** — `@supabase/supabase-js` and `@supabase/ssr` installed; `npm ci` clean.
- [ ] **B3** — `supabase/migrations/0000_init.sql` applied to shared dev DB; `supabase/README.md` committed.
- [ ] **B4** — `lib/env.ts` shipping; missing-var error verified by deleting `.env.local` and rerunning `npm run dev`.
- [ ] **C1** — Vitest installed; `npm test` green with 1 sanity test.
- [ ] **C2** — `.github/workflows/ci.yml` green on a real PR.
- [ ] **D2** — `Profile`, `Session`, `Funding` contracts at `// STATUS: LOCKED` with Dev B's review.

**Phase commit:** `chore(bootstrap): complete V2.P1 shared bootstrap`

---

## Step 1 — Identity Foundation (V2.P2)

- [ ] `lib/supabase/client.ts` and `lib/supabase/server.ts` added.
- [ ] `app/(identity)/sign-in/page.tsx` renders Google sign-in button.
- [ ] `app/auth/callback/route.ts` exchanges code and redirects (onboarding vs dashboard).
- [ ] `app/(identity)/sign-out/route.ts` clears session.
- [ ] `lib/session/get-session.ts` exports `GetSession`; returns `Session | null`.
- [ ] `lib/session/use-session.ts` exports `useSession` hook.
- [ ] `lib/auth/route-policies.ts` exports merged `RoutePolicyRegistry` (handles missing Dev B file gracefully).
- [ ] `middleware.ts` consults the registry, gates by role with most-specific-prefix-wins.
- [ ] `supabase/migrations/0001_profiles.sql` applied; `profiles` row trigger working.
- [ ] Vitest suite for `get-session` green.
- [ ] **Proof:** sign in with Google on a fresh browser → `profiles` row exists → `GetSession()` returns shape.
- [ ] **Commit:** `feat(auth): add Supabase Google OAuth and session contract`

---

## Step 2 — Role Selection & Onboarding (V2.P2 → V2.P3)

- [ ] `Session.role` lock decision made (`Role | null`) and reflected in `build/contracts/session.ts`.
- [ ] `app/onboarding/page.tsx` role selector.
- [ ] `app/onboarding/[role]/page.tsx` per-role profile form.
- [ ] `lib/profile/upsert.ts` server actions.
- [ ] Callback redirects null-role → `/onboarding`, set-role → `/dashboard`.
- [ ] `supabase/migrations/0002_role_profiles.sql` applied.
- [ ] `supabase/migrations/0010_rls_identity.sql` applied; cross-user read returns nothing.
- [ ] Vitest suite for `upsert` green.
- [ ] **Proof:** role pick → form fill → row persisted → returning user skips onboarding.
- [ ] **Commit:** `feat(profile): add per-role onboarding and profile persistence`

---

## Step 3 — Forum Domain (V2.P3)

- [ ] `app/forum/page.tsx` lists real threads.
- [ ] `app/forum/[threadId]/page.tsx` shows thread + replies + new-reply form.
- [ ] `app/forum/new/page.tsx` creates a thread.
- [ ] `lib/forum/queries.ts` exports CRUD helpers.
- [ ] Author role badge renders.
- [ ] Forum tables added to `supabase/migrations/0010_rls_identity.sql` (or paired migration).
- [ ] Vitest suite for forum queries green.
- [ ] **Proof:** post thread → reply → reload → both persist; cross-user edit blocked by RLS.
- [ ] **Commit:** `feat(forum): add persisted threads and replies`

---

## Step 4 — Shell & Navigation (V2.P3)

- [ ] `components/layout/Navbar.tsx` role-aware (signed-in shows correct funding link).
- [ ] `app/page.tsx` redirects signed-in users to `/dashboard`.
- [ ] `app/providers.tsx` exposes auth context using `useSession`.
- [ ] **Proof:** three role accounts each see correct navbar link; sign-out returns to public landing.
- [ ] **Commit:** `feat(shell): add role-aware navbar and landing redirect`

---

## Step 5 — Integration Consumption (V2.P4)

- [ ] Confirmed Dev B's `GetFundingSummariesForUser` is stable on `main` against real ETL data.
- [ ] `app/dashboard/page.tsx` composes profile + funding summary + forum activity tiles.
- [ ] (Optional) landing teaser uses `GetFundingSummariesForUser`.
- [ ] Vitest suite for dashboard composer green.
- [ ] **Proof:** three role accounts each see role-appropriate funding tiles on dashboard.
- [ ] **Commit:** `feat(dashboard): integrate funding summaries`

---

## Step 6 — Hardening (V2.P5)

- [ ] Zero `from "@/lib/demo"` or `from "@/components/demo"` in Dev A owned files.
- [ ] Vitest coverage on: sign-in callback, onboarding upsert, forum CRUD, dashboard composer.
- [ ] (Optional) Playwright happy-path: sign-in → onboarding → post-thread.
- [ ] README updated with Dev A flows.
- [ ] **Proof:** all suites green; `grep -r "lib/demo" app/(identity) app/onboarding app/profile app/forum app/dashboard lib/auth lib/profile lib/forum lib/session` returns nothing.
- [ ] **Commit:** `chore(hardening): remove demo imports and add identity tests`

---

## Blockers

(Log here only with a named missing deliverable per `ownership.md` "Allowed blockers." None recorded yet.)

## Notes

(Free-form. Use sparingly.)
