# V2.P1 Shared Bootstrap

This is the shared setup work that must complete **before** Dev A and Dev B can start V2.P2. It is the only gate that legitimately blocks both tracks at once.

Each item names the **assigned owner** and the **deliverable that proves it is done**.

---

## Bootstrap Owner

**Default owner: Dev A.** Reason: most shared bootstrap touches identity/config files Dev A already owns. Dev B is reviewer on every bootstrap PR.

Exception: scraper workspace skeleton is owned by Dev B (see B5).

---

## A. Repo Restructuring

### A1 — Mixed-file surgery PR

- **Owner:** Dev A (single PR, Dev B reviews)
- **What:** Execute every move listed in `build/shared/ownership.md` "Mixed-File Surgery" table.
- **Deliverable:** PR titled `chore(restructure): split mixed demo files and create domain folders`. After merge:
  - `app/(demo)/**`, `components/demo/**`, `lib/demo/**`, `data/demo/**` populated.
  - Empty target folders exist with placeholder `index.ts` per domain.
  - `npm run build` and `npm run lint` still pass.
  - Demo URLs (`/(demo)/funding`, `/(demo)/matchmaker`, `/(demo)/talent`) reachable in dev.

### A2 — TypeScript path aliases for contracts

- **Owner:** Dev A
- **What:** Add `paths` entry to `tsconfig.json` so contracts import as `@contracts/*`.
- **Deliverable:**
  ```json
  "paths": {
    "@contracts/*": ["build/contracts/*"]
  }
  ```
  Test: a throwaway `lib/_check.ts` importing `@contracts/role` typechecks.

### A3 — Convert BusinessContext.jsx to .tsx

- **Owner:** Dev A
- **What:** Rename `lib/demo/BusinessContext.jsx` to `.tsx`, add minimal types.
- **Deliverable:** File renamed, no `any` types added, build passes. Optional; punt to Dev A's hardening if it bloats the surgery PR.

---

## B. Backend / Infra

### B1 — Supabase project provisioned

- **Owner:** Dev A
- **What:** Create a single shared Supabase project (free tier). Capture URL, anon key, service role key into a private credentials note (NOT committed). Add corresponding entries to `.env.example`.
- **Deliverable:**
  - `.env.example` contains:
    ```
    NEXT_PUBLIC_SUPABASE_URL=
    NEXT_PUBLIC_SUPABASE_ANON_KEY=
    SUPABASE_SERVICE_ROLE_KEY=
    ```
  - Both devs can sign in to the Supabase dashboard.
  - Both devs have a working local `.env.local` (verified by running `npm run dev` and reaching the home page without an env-guard crash).

### B2 — Supabase JS dependency installed

- **Owner:** Dev A
- **What:** Install `@supabase/supabase-js` and `@supabase/ssr` (App Router cookie helper).
- **Deliverable:** `package.json` updated, `package-lock.json` committed, `npm ci` clean. Dev B reviews the diff (single-purpose PR).

### B3 — Migration tooling decision

- **Decision:** Use **raw SQL files in `supabase/migrations/`** applied via `supabase db push` from the Supabase CLI. No Prisma. Numbered `NNNN_description.sql`.
- **Owner:** Dev A
- **Deliverable:** `supabase/migrations/.gitkeep`, a `supabase/README.md` explaining the convention and migration numbering protocol (see `conventions.md`), and a sample no-op migration `0000_init.sql` that lands in the shared dev DB.

### B4 — Env-guard helper

- **Owner:** Dev A
- **What:** `lib/env.ts` exports a typed `env` object that throws with a clear message on missing required vars. Imported by both Supabase client modules.
- **Deliverable:** `lib/env.ts` committed; `npm run dev` without `.env.local` fails with a clear "missing NEXT_PUBLIC_SUPABASE_URL" error instead of a runtime crash deeper in the app.

### B5 — Scraper workspace skeleton

- **Owner:** Dev B
- **What:** Create `scraper/` as a separate Node package with its own `package.json` and `tsconfig.json`. No npm workspaces; the scraper is invoked by GitHub Actions and not bundled with the Next.js app.
- **Deliverable:**
  - `scraper/package.json` with `cheerio` and `@supabase/supabase-js`.
  - `scraper/tsconfig.json`.
  - `scraper/index.ts` with a `console.log("scraper bootstrapped")` placeholder.
  - `scraper/README.md` explaining how the scraper is invoked.
  - `cd scraper && npm install && npx tsx index.ts` prints the placeholder line.

---

## C. Quality / Tooling

### C1 — Vitest installed and wired

- **Owner:** Dev A
- **What:** Install `vitest` + `@vitest/coverage-v8`. Add `npm test` and `npm run test:watch` to root `package.json`. Add a single sanity test that imports a contract type.
- **Deliverable:** `npm test` runs and reports 1 pass.

### C2 — CI workflow

- **Owner:** Dev A
- **What:** `.github/workflows/ci.yml` runs `npm ci`, `npm run lint`, `npm run build`, `npm test` on push and PR.
- **Deliverable:** Workflow file committed; first PR after merge shows a green CI run.

### C3 — Scrape workflow stub

- **Owner:** Dev B
- **What:** `.github/workflows/scrape.yml` with cron schedule disabled by default and a manual `workflow_dispatch` trigger that runs `cd scraper && npm ci && npx tsx index.ts`.
- **Deliverable:** Workflow file committed. Manual run from GitHub UI succeeds and prints the placeholder line.

---

## D. Contract Lock-in

### D1 — Lock the LOCKED contracts

- **Owner:** Dev A (role, route-policy)
- **What:** Confirm `build/contracts/role.ts` and `build/contracts/route-policy.ts` are LOCKED. No further edits without the protocol.
- **Deliverable:** Both files contain `// STATUS: LOCKED`. Confirmed in Dev A's progress.md "Contract changes consumed" section.

### D2 — Promote DRAFT contracts to LOCKED

- **Owner:** Dev A (profile, session), Dev B (funding)
- **What:** Walk through each DRAFT contract, agree on field set, change `// STATUS: DRAFT` to `// STATUS: LOCKED`.
- **Deliverable:** All five contract files at LOCKED. This is the V2.P1 completion gate.

---

## V2.P1 Completion Gate (proof required)

Tick all of these to advance to V2.P2:

- [ ] **A1** — surgery PR merged; demo URLs work; build green.
- [ ] **A2** — `@contracts/*` import resolves.
- [ ] **B1** — both devs hit Supabase dashboard; `.env.example` complete.
- [ ] **B2** — `npm ci` clean with supabase-js installed.
- [ ] **B3** — `supabase/migrations/0000_init.sql` applied to shared dev DB.
- [ ] **B4** — `lib/env.ts` shipping, missing-var error verified.
- [ ] **B5** — `cd scraper && npx tsx index.ts` works.
- [ ] **C1** — `npm test` green with one sanity test.
- [ ] **C2** — CI workflow green on a real PR.
- [ ] **C3** — scrape workflow runs from GitHub UI.
- [ ] **D2** — all five contract files at LOCKED.

Only after every box is ticked do Dev A and Dev B start their V2.P2 tracks.
