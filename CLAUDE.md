# Auctus AI — V2 Build Workflow

> **Multi-role Canadian funding platform** — Business grants, student scholarships, and professor research funding with automated scraping, Google auth, and (deferred) AI advisor.

V2 build is executed by two developers in parallel from the docs under `build/`. The files in `claude/` are reference and legacy.

## Read at session start

- `build/gameplan.md` — committed scope and locked decisions
- `build/shared/buildflow.md` — master phase tracker (single source of truth for phases)
- `build/shared/ownership.md` — folder/route/DB/migration/shared-file ownership
- `build/shared/conventions.md` — branching, PRs, commits, migrations, tests
- `build/shared/contracts.md` — pointer to typed contracts in `build/contracts/`
- `build/shared/bootstrap.md` — V2.P1 shared setup checklist
- The dev-specific buildflow + progress for whichever developer you are working with:
  - `build/dev-a/buildflow.md` + `progress.md` (identity & community)
  - `build/dev-b/buildflow.md` + `progress.md` (funding & pipelines)

## Reference (load on demand)

- `claude/ProjectSummary.md` — product vision (NOT the build plan)
- `claude/CurrentStatus.md` — snapshot of what exists in the repo today

## Legacy (history only, do not act on)

- `claude/BuildFlow.md` — V1 P1-P7 demo build flow
- `claude/Progress.md` — V1 P1-P7 progress tracker

Operate in **Senior Coder Mode** as defined in `claude/Claude_guide.md` at all times.

Commands: `/progress-log` | `/progress-save` | `/phase-check` | `/phase-done` | `/phase-explain` | `/step-explain`

---

## Phase Numbering

To avoid collision with V1 P1-P7 (complete), V2 phases are numbered `V2.P1` through `V2.P5`:

| Phase | Theme |
|---|---|
| V2.P1 | Shared Bootstrap & Restructuring |
| V2.P2 | Parallel Domain Foundation |
| V2.P3 | Parallel Core Delivery |
| V2.P4 | Controlled Integration |
| V2.P5 | Hardening & Release Prep |

Detail in `build/shared/buildflow.md`.

---

## GATE SYSTEM

Every V2 phase has a corresponding gate. **G[V2.PN] = V2.PN.** Nothing proceeds until its gate passes.

- Each gate has **pass conditions** — every condition must be true.
- Claude **verifies** conditions before declaring a gate passed.
- Gates are sequential — no skipping.
- Blocked gate = stop, tell user what's unmet, work on ONLY that.

V2.P2 and V2.P3 have **two parallel completion gates** — one per dev track. The shared gate passes only when both dev gates pass.

---

## THREE USER ROLES

| Role | Sees | Route |
|---|---|---|
| Business | Business grants | `/grants` |
| Student | Scholarships | `/scholarships` |
| Professor | Research grants | `/research-funding` |

Routes are organized under `app/(funding)/{grants,scholarships,research-funding}/` (route group; the `(funding)` segment does not appear in URLs). Content isolation enforced via middleware + RLS — users only see their role's funding data.

---

## KEY TECH DECISIONS (V2)

- **Database:** Supabase (PostgreSQL, free tier)
- **Auth:** Supabase Auth with Google OAuth, 3 roles (`business`, `student`, `professor`)
- **Migrations:** raw SQL files in `supabase/migrations/`, applied with Supabase CLI
- **Scraping:** GitHub Actions daily cron + cheerio, separate `scraper/` Node package
- **AI Chatbot:** deferred; legacy chatbot stays mounted as-is in `(demo)`
- **Removed from active scope:** Matchmaker, Talent (moved to `app/(demo)/`)

---

## TWO-DEVELOPER MODEL

| Dev | Owns |
|---|---|
| **Dev A** | auth, roles, onboarding, profiles, forum, route protection, shell composition, dashboard |
| **Dev B** | funding domain, matching, ETL, ingestion, role-aware visibility |

Boundaries enforced by `build/shared/ownership.md`. Cross-domain coordination through typed contracts in `build/contracts/`, never through editing each other's folders.

---

## GATE PASS PROTOCOL

Before declaring any phase complete:

1. Read the relevant `build/dev-*/progress.md` — every checkbox in the phase must be `[x]`.
2. Verify proof — every step has a "Proof:" line; the proof must be demonstrated, not asserted.
3. Verify commit format: `git log --oneline -1` matches `type(scope): desc` per `build/shared/conventions.md`.
4. If phase has tests: all relevant Vitest suites green; CI green on the merging PR.
5. If phase has migrations: migration applied to the shared dev DB; verified by query.
6. If phase has secrets/env: no hardcoded values, env-guard passes for missing vars.
7. Cross-domain dependencies: every "Allowed blocker" in `ownership.md` resolved before declaring complete.

**If all met:** update Current Phase in the relevant `progress.md`, advance, announce next phase.
**If any unmet:** list what's missing. Do NOT advance.

### Skip prevention

If the user says "skip to", "move ahead", "come back later", or "do [future phase] first":

> "Gate G[V2.PN] is blocking. Unmet: [list]. We cannot proceed until these pass. Which item do you want to tackle first?"

---

## GATE STATE TRACKING

`build/dev-a/progress.md` and `build/dev-b/progress.md` are sources of truth for their tracks.
`build/shared/buildflow.md` is the source of truth for phase order and dependencies.

Status derived from:

- Current Phase line at the top of each `progress.md`.
- Checkbox state: `[ ]` vs `[x]`.

Claude marks a box `[x]` only after verifying the **proof**. "Done" → demand proof, then check.
