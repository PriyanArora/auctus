# Auctus AI — Gated Build Workflow

> **Multi-role Canadian funding platform** — Business grants, student scholarships, and professor research funding with automated scraping, Google auth, and AI advisor.

Read before every task:

- `claude/Claude_guide.md` — 13 habits, response rules, red lines
- `claude/ProjectSummary.md` — architecture, data models, API reference
- `claude/BuildFlow.md` — phases with tasks and checkpoints + V2 engineering spec
- `claude/Progress.md` — current phase and completion state

Operate in **Senior Coder Mode** as defined in `claude/Claude_guide.md` at all times.

Commands: `/progress-log` | `/progress-save` | `/phase-check` | `/phase-done` | `/phase-explain` | `/step-explain`

---

## GATE SYSTEM

Phases 1-7 are complete (v1 frontend). V2 phases are being defined — see `BuildFlow.md` engineering spec.

Once V2 phases are finalized, every phase (P8-P[N]) has a corresponding gate. G[X] = P[X]. Nothing proceeds until its gate passes.

- Each gate has **pass conditions** — every condition must be true
- Claude **verifies** conditions before declaring a gate passed
- Gates are sequential — no skipping
- Blocked gate = stop, tell user what's unmet, work on ONLY that

---

## THREE USER ROLES

| Role | Sees | Route |
|---|---|---|
| Business | Business grants | `/grants` |
| Student | Scholarships | `/scholarships` |
| Professor | Research grants | `/research-funding` |

Content isolation enforced via middleware — users only see their role's funding data.

---

## KEY TECH DECISIONS (V2)

- **Database:** Supabase (PostgreSQL, free tier)
- **Auth:** Supabase Auth with Google OAuth, 3 roles
- **Scraping:** GitHub Actions daily cron + cheerio, 15 sources
- **AI Chatbot:** OpenRouter API (free models), replacing hardcoded responses
- **Removed:** Matchmaker page
- **Deferred:** Talent page improvements

---

## GATE PASS PROTOCOL

**Before declaring any phase complete:**

1. Read `claude/Progress.md` — ALL checkboxes for the phase must be `[x]`
2. Verify commit: `git log --oneline -1` — format must be `type(scope): desc`
3. If phase has tests: all tests must pass
4. If phase has config/secrets: no hardcoded values, env guard verified
5. Results demonstrated — never accept claims without proof

**If all met:** Update Progress.md status → `[complete]`, advance Current Phase, announce next phase.
**If any unmet:** List what's missing. Do NOT advance.

### Skip prevention

If the user says "skip to", "move ahead", "come back later", or "do [future phase] first":

> "Gate G[X] is blocking. Unmet: [list]. We cannot proceed until these pass. Which item do you want to tackle first?"

---

## GATE STATE TRACKING

`Progress.md` is source of truth. Status derived from:
- Phase status tag: `[not started]` | `[in progress]` | `[complete]`
- Checkbox state: `[ ]` vs `[x]`

Claude marks a box `[x]` only after verifying the condition. "Done" → verify, then check.
