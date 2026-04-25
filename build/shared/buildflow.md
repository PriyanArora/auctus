# Shared Buildflow — Master Phase Tracker

The single source of truth for V2 phase order, true prerequisites, parallel tracks, handoffs, and integration points.

Phases are numbered `V2.P1` through `V2.P5` to avoid collision with the legacy V1 P1-P7.

---

## Coordination Rules

- **Parallel is the default.** A dependency exists only when a real prerequisite exists.
- Every dependency names the **exact deliverable**.
- "Wait for the other dev" without a named deliverable is not a valid blocker.
- Shared bootstrap (V2.P1) and integration (V2.P4) are the only legitimately coordination-heavy moments.
- Most feature work happens inside owned domains.

---

## V2.P1 — Shared Bootstrap & Restructuring

### Purpose

Make the repo safe for two developers to work in parallel without overlap.

### Owner

Shared. Default executor: Dev A. Reviewer: Dev B. Scraper skeleton item is owned by Dev B.

### Required Outputs

All checklist items in `build/shared/bootstrap.md`. Highlights:

- Mixed-file surgery PR merged. Demo URLs work. Build green.
- `app/`, `components/`, `lib/` reorganized to the target shape in `ownership.md`.
- `supabase/migrations/` exists; baseline `0000_init.sql` applied to shared dev DB.
- `.env.example` complete; `lib/env.ts` env-guard shipping.
- `@supabase/supabase-js` and `@supabase/ssr` installed.
- `tsconfig.json` resolves `@contracts/*`.
- `npm test` green with one sanity test.
- `.github/workflows/ci.yml` green on a real PR.
- `scraper/` skeleton runs end-to-end.
- All five contract files at `// STATUS: LOCKED`.

### Completion Gate

Every checkbox in `bootstrap.md` "V2.P1 Completion Gate" is ticked. Both devs can `git pull main` and start their V2.P2 step 1 with zero ambiguity about what they own.

### Unblocks

V2.P2 for both tracks.

---

## V2.P2 — Parallel Domain Foundation

### Purpose

Both devs build skeletons inside their owned folders. No cross-domain code yet.

### Dev A Track (see `build/dev-a/buildflow.md` Steps 2-3)

- Supabase auth wiring (sign-in, sign-out, callback).
- Session helpers in `lib/session/` publishing `Session`, `GetSession`, `UseSession`.
- Migrations `0001_profiles.sql`, `0002_forum.sql` applied.
- Empty route policy registry shipped (publishes `RoutePolicyRegistry`).
- Profile pages scaffolded (no persistence yet).

### Dev B Track (see `build/dev-b/buildflow.md` Steps 2-3)

- Migration `0003_funding.sql` applied (unified table, status enum, role-aware index).
- `lib/funding/queries.ts` publishing `ListFundingForRole`, `GetFundingById`, `GetFundingSummariesForUser` against a small seed dataset.
- Funding listing pages scaffolded under `app/(funding)/{grants,scholarships,research-funding}/page.tsx`. Show seed data, no auth gating yet.
- `lib/funding/route-policies.ts` registers `/grants`, `/scholarships`, `/research-funding` per `RoutePolicy` shape.

### Real Dependencies in V2.P2

| Dependency | What unblocks | Owner |
|---|---|---|
| `Role` enum LOCKED | Dev B's funding query uses `role` field | Dev A → Dev B (already LOCKED in V2.P1) |
| `RoutePolicy` shape LOCKED | Dev B can register funding routes | Dev A → Dev B (already LOCKED in V2.P1) |
| `Session` shape LOCKED | Dev B's role-aware visibility code can read session | Dev A → Dev B (LOCKED in V2.P1 D2) |

That is it. There are no other true dependencies in V2.P2.

### Completion Gate

- Dev A: sign-in works end to end on a fresh browser; profile pages render placeholder data.
- Dev B: `/grants`, `/scholarships`, `/research-funding` render seed data; query helpers callable from a Vitest test.
- Both: typecheck, lint, build, test all green on `main`.

### Unblocks

V2.P3 for both tracks.

---

## V2.P3 — Parallel Core Delivery

### Purpose

Real persistence inside each domain. Still no cross-domain code beyond the locked contracts.

### Dev A Core Delivery

- Real role selection during onboarding.
- `business_profiles`, `student_profiles`, `professor_profiles` migrations + persistence (Dev A Steps 3-4).
- Real forum: `threads` + `replies` CRUD with real authorship.
- Route protection live: `middleware.ts` consults the combined `RoutePolicyRegistry` and gates routes by role.

### Dev B Core Delivery

- Real funding listing with role-aware filtering and detail page per type.
- `lib/matching/` per-role match scoring functions reading `RoleProfile` (the LOCKED shape).
- ETL pipeline: scrapers, normalize, dedupe, expire, upsert into `funding`.
- `funding`-side RLS migrations applied.
- Daily scrape workflow enabled (cron uncommented in `scrape.yml`).

### Real Dependencies in V2.P3

| Dependency | What unblocks | Owner |
|---|---|---|
| `Profile` + `RoleProfile` LOCKED | Dev B's `lib/matching/` can score real users | Dev A → Dev B (already LOCKED in V2.P1 D2) |
| Identity-side RLS landed (`0010_*`) | Dev B's funding RLS can reference `profiles.role` safely | Dev A → Dev B |
| `funding` table seeded | Dev A's dashboard tile can call `GetFundingSummariesForUser` and get back rows during V2.P4 | Dev B → Dev A (consumed in V2.P4, not V2.P3) |

Note: matching is technically gated on the LOCKED `Profile` shape, not on Dev A's persistence. Once the contract is locked, Dev B can implement matching against the type without waiting for Dev A's migrations to land in the dev DB.

### Completion Gate

- Dev A: a real user signs in, picks a role, completes onboarding, edits profile, posts a thread, replies. All persisted.
- Dev B: a real user (created via Supabase dashboard with a manual role assignment) sees role-appropriate funding. ETL run produces ≥ 1 new funding row from at least one source.
- Both: tests cover their domain's happy path.

### Unblocks

V2.P4.

---

## V2.P4 — Controlled Integration

### Purpose

Wire cross-domain features. The only phase where both devs intentionally edit shared composition points.

### Integration Targets

| Target | Owner of composition | Consumes |
|---|---|---|
| Dashboard funding tiles | Dev A (composer) | Dev B's `GetFundingSummariesForUser` |
| Role-aware navbar (funding link per role) | Dev A | `Role` enum + `ROLE_DEFAULT_ROUTE` |
| Landing page CTAs | Dev A | none (static) |
| Forum role badge on author | Dev A | `Profile.role` (already inside Dev A's domain) |
| Funding RLS reading `profiles.role` | Dev B | `Profile` table (read-only) |
| Real session in funding listing | Dev B | `GetSession` from Dev A |

### Required Handoffs

- Dev A confirms: `Profile`, `Session`, `Role`, `RoutePolicyRegistry` are all LOCKED and stable on `main`.
- Dev B confirms: `FundingItem`, `FundingQuery`, `FundingSummary`, `ListFundingForRole`, `GetFundingSummariesForUser`, `GetFundingById` are all stable on `main` with real data.
- Both confirm: integration PRs land in this order — (1) Dev B publishes summary endpoint stable; (2) Dev A wires dashboard tile; (3) Dev A wires landing teaser if any.

### Shared Files Likely Touched

- `app/dashboard/page.tsx` — Dev A only.
- `components/layout/Navbar.tsx` — Dev A only.
- `app/page.tsx` — Dev A only.
- New shared types — added to `build/contracts/` per the change protocol, not invented in domain folders.

### Completion Gate

A real user of each role can:

1. Sign in with Google.
2. Land on their role-appropriate dashboard.
3. See real funding summaries on the dashboard.
4. Click through to the funding listing for their role.
5. Open a funding detail page and see real eligibility data.
6. Open the forum, post a thread, get a reply, see the role badge.

### Unblocks

V2.P5.

---

## V2.P5 — Hardening & Release Prep

### Purpose

Stabilize the new core platform after integration.

### Shared Outcomes

- Tests cover core user flows (sign-in, onboarding, profile edit, forum CRUD, funding list per role, dashboard render).
- ETL has a data-quality test (no funding row with `amount_min > amount_max`, no past-deadline rows with `status='active'`, etc.).
- Demo behavior in active scope is removed (no V2 page imports from `lib/demo/` or `components/demo/`).
- README updated with: env vars, dev setup, Supabase migration command, scraper run command.
- Vercel env vars set in production.

### Owners

- Dev A: identity/community test coverage, README, demo-import audit on owned files.
- Dev B: funding/ETL test coverage, scraper docs, demo-import audit on owned files.
- Shared: deployment readiness checklist.

### Completion Gate

- All checks in this phase tick.
- A QA pass by both devs against a third Supabase test project succeeds end-to-end.

---

## Deferred Beyond Current Window

- AI chat integration (legacy chatbot stays mounted as-is).
- Talent product work.
- Matchmaker product work.
- Major redesign exploration.

---

## Expected Handoff Deliverables

### Dev A → Dev B (named, by gate)

| Deliverable | Type | LOCKED by |
|---|---|---|
| `build/contracts/role.ts` | type | V2.P1 |
| `build/contracts/profile.ts` | type | V2.P1 |
| `build/contracts/session.ts` | type | V2.P1 |
| `build/contracts/route-policy.ts` | type | V2.P1 |
| `lib/session/get-session.ts` | runtime export of `GetSession` | V2.P2 |
| `supabase/migrations/0001_profiles.sql` applied | DB | V2.P2 |
| `supabase/migrations/0010_rls_identity.sql` applied | DB | V2.P3 |

### Dev B → Dev A (named, by gate)

| Deliverable | Type | LOCKED by |
|---|---|---|
| `build/contracts/funding.ts` | type | V2.P1 |
| `lib/funding/queries.ts` exports `ListFundingForRole`, `GetFundingById`, `GetFundingSummariesForUser` | runtime | V2.P2 (against seed); V2.P3 (against real ETL data) |
| `lib/funding/route-policies.ts` exports its registry | runtime | V2.P2 |
| `supabase/migrations/0003_funding.sql` applied | DB | V2.P2 |
| `funding` table populated from ETL run | data | V2.P3 |

---

## Shared Success Condition

The project succeeds only if:

- Both devs work mostly independently through V2.P2 and V2.P3.
- The shared buildflow contains only real prerequisites.
- Ownership boundaries are respected.
- Integration in V2.P4 happens through contracts, not opportunistic edits.
