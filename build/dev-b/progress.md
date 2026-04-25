# Dev B Progress — Priyan

Mirror of `build/dev-b/buildflow.md`. A step is `[x]` only when **proof** is shown, not when code is written.

**Owner:** Priyan
**Domain:** funding & pipelines (funding domain, matching, ETL, ingestion, role-aware visibility)

## Current Phase

V2.P1 — Shared Bootstrap & Restructuring (not started)

## Contract Changes Consumed

(One line per locked-contract change Dev B consumed. Initially empty.)

---

## Step 0 — Shared Bootstrap (V2.P1)

Dev A drives most of bootstrap. Dev B's own items:

- [ ] **B5** — `scraper/` skeleton runs: `cd scraper && npx tsx index.ts` prints bootstrap line.
- [ ] **C3** — `.github/workflows/scrape.yml` manual `workflow_dispatch` succeeds from GitHub UI.
- [ ] **D2** — `funding.ts` at `// STATUS: LOCKED` after Dev A's review.
- [ ] Reviewed and approved Dev A's surgery PR (A1).
- [ ] Reviewed and approved Dev A's supabase-js install PR (B2).
- [ ] Read `build/contracts/` end-to-end.
- [ ] Drafted (not committed) the `0003_funding.sql` schema and 2-3 source reconnaissance notes.

**Phase commit:** `chore(bootstrap): scraper workspace and funding contract lock`

---

## Step 1 — Funding Domain Foundation (V2.P2)

- [ ] `supabase/migrations/0003_funding.sql` applied; indexes and trigger present.
- [ ] `supabase/seeds/funding_seed.sql` committed; seed rows visible in shared dev DB.
- [ ] `lib/funding/supabase.ts` server client.
- [ ] `lib/funding/queries.ts` exports `ListFundingForRole`, `GetFundingById`, `GetFundingSummariesForUser` (no scoring yet).
- [ ] `lib/funding/role-mapping.ts` covers all three roles.
- [ ] `lib/funding/route-policies.ts` registers `/grants`, `/scholarships`, `/research-funding`.
- [ ] Vitest: queries return rows shaped per `FundingItem`/`FundingSummary`.
- [ ] **Proof:** `ListFundingForRole({ role: 'student' })` returns only `scholarship` rows; middleware (Dev A) gates the routes once Dev A imports the registry.
- [ ] **Commit:** `feat(funding): add unified funding table and query helpers`

---

## Step 2 — Funding Pages (V2.P2)

- [ ] `app/(funding)/grants/page.tsx`, `scholarships/page.tsx`, `research-funding/page.tsx` server components.
- [ ] Per-role detail pages.
- [ ] `components/funding/FundingList.tsx`, `FundingCard.tsx`, `FundingDetail.tsx`, `FundingFilters.tsx`.
- [ ] `components/funding/FundingSummaryTile.tsx` exported for Dev A.
- [ ] Vitest snapshot for `FundingCard`.
- [ ] **Proof:** all three role listings render seed rows in dev; detail pages render eligibility breakdown.
- [ ] **Commit:** `feat(funding): add role-aware listing and detail pages`

---

## Step 3 — Matching (V2.P3)

- [ ] `lib/matching/business.ts`, `student.ts`, `professor.ts` implemented per ProjectSummary weights.
- [ ] `lib/matching/index.ts` `scoreFor` dispatch.
- [ ] `GetFundingSummariesForUser` consumes Dev A's `getRoleProfile`, returns scored summaries.
- [ ] Vitest covers each scoring function with fixtures.
- [ ] **Proof:** seeded business → matching ordering plausible; scored summaries render in a Vitest test.
- [ ] **Blocker check:** Dev A's `getRoleProfile` published? If not, log it in Blockers.
- [ ] **Commit:** `feat(matching): add per-role match scoring`

---

## Step 4 — ETL & Ingestion (V2.P3)

- [ ] `scraper/types.ts`, `utils.ts`, `normalize.ts`, `deduplicate.ts`, `expire.ts`, `index.ts`.
- [ ] Exactly 2 sources per role (6 total) implemented under `scraper/sources/{business,student,professor}/`.
- [ ] `scraper/index.ts` uses a `SOURCES` array — adding a source needs zero orchestrator changes (verified by adding a stub, running, removing).
- [ ] `supabase/migrations/0004_scrape_metadata.sql` applied.
- [ ] `.github/workflows/scrape.yml` cron uncommented and live.
- [ ] Vitest fixtures for each scraper.
- [ ] Dedupe test covers insert/update/skip.
- [ ] **Proof:** manual workflow run on clean DB produces ≥ 1 new row per source; `scrape_runs` row recorded.
- [ ] **Commit:** `feat(scraper): add ETL pipeline with dedupe and expiry`

---

## Step 5 — Funding RLS (V2.P3)

- [ ] `supabase/migrations/0011_rls_funding.sql` applied.
- [ ] Cross-role query returns nothing.
- [ ] Anonymous query returns nothing.
- [ ] Service role still ingests via scraper.
- [ ] **Blocker check:** Dev A's `0010_rls_identity.sql` landed? If not, log it in Blockers.
- [ ] **Proof:** Vitest with two role users each only sees their type.
- [ ] **Commit:** `feat(funding): add RLS for role-aware visibility`

---

## Step 6 — Integration Publishing (V2.P4)

- [ ] All `lib/funding/queries.ts` runtime exports stable on `main` with real ETL data.
- [ ] Notified Dev A (entry in their `progress.md` "Contract changes consumed").
- [ ] Reviewed Dev A's dashboard tile PR; required no contract change.
- [ ] **Proof:** Dev A's dashboard renders real funding tiles for each role.
- [ ] **Commit:** `docs(funding): confirm contracts stable for integration`

---

## Step 7 — Hardening (V2.P5)

- [ ] Zero `from "@/lib/demo"` or `from "@/components/demo"` in Dev B owned files.
- [ ] Data-quality assertions green: no `amount_min > amount_max`, no past-deadline `status='active'`.
- [ ] `scraper/README.md` covers env, run, expected output.
- [ ] Vitest end-to-end for funding flow.
- [ ] **Proof:** all suites green; data-quality SQL returns 0 violations on live dev DB.
- [ ] **Commit:** `chore(hardening): remove demo imports and add funding tests`

---

## Blockers

(Log here only with a named missing deliverable per `ownership.md` "Allowed blockers." None recorded yet.)

## Notes

(Free-form. Use sparingly.)
