# ETL Gameplan — Finish G10 First

Last updated: 2026-04-30

This document is the practical checklist for finishing the ETL work without mixing it up with later dashboard/release gates.

## Current State

G10 is now complete. Claude's original scaffold was tuned against live official pages, rate limiting was added, real Supabase ingestion proof was captured, and the GitHub scrape workflow was manually proven clean.

Observed review result:

- `npm test` passed: 21 files / 101 tests.
- `npm run lint` passed with legacy demo warnings only.
- `npm run build` passed.
- `npx tsc -p scraper/tsconfig.json --noEmit` passed.
- `npx tsx index.ts --dry-run` returned 566 rows across all six sources with 0 errors.
- Real `npx tsx index.ts` inserted/updated rows and recorded successful `scrape_runs` for all six sources.

The ETL pipeline is scheduled to run daily at `03:00 UTC`, with `workflow_dispatch` still available for manual runs.

## What You Need To Do

### Required After G10

You do not need to code the scraper. The local code-side G10 work is done.

You may need to help with these items:

1. Confirm the first scheduled GitHub run succeeds after the cron fires.
2. Keep an eye on Supabase row counts and GitHub Actions usage if the scrape cadence is increased later.

### Manual Dashboard/Admin Items

These are not code tasks and need either your browser access or your credentials:

1. Google OAuth setup in Google Cloud and Supabase.
2. Email magic-link inbox proof.
3. Browser proof of sign-in, onboarding, dashboard, navbar, and sign-out.
4. GitHub scrape cron proof after the first scheduled run.

## What I Can Do

### G10 — ETL Pipeline

The code side of G10 is complete:

1. Inspected each official source live.
2. Replaced speculative parser selectors with live-tuned parsing.
3. Enforced each source's `rateLimitMs`.
4. Made `npx tsx index.ts --dry-run` return real normalized rows.
5. Ran the real scraper against Supabase.
6. Verified `funding_sources` and `scrape_runs`.
7. Updated `codex/SoloProgress.md` and `codex/Handoff.md`.

Remaining G10-adjacent manual item: first scheduled cron run proof.

### G11 — RLS and Dashboard Integration

I can do most of G11 after G10 is closed:

1. Validate and apply `0020_rls_funding.sql`.
2. Verify funding RLS policies in SQL metadata.
3. Fix the dashboard deadline date comparison.
4. Verify dashboard composition uses the published funding/forum helpers.
5. Run tests, lint, and build.
6. Update proof logs.

You still need to do or enable manual proof for:

- browser sign-in as business/student/professor;
- visual dashboard role proof;
- cross-role browser behavior if we cannot create test users programmatically.

### G12 — Hardening and Release QA

I can do nearly all code/documentation QA:

1. Audit active code for demo import leaks.
2. Run data-quality checks.
3. Add or adjust missing tests.
4. Update README, Supabase docs, and scraper docs.
5. Run final lint/build/test/scraper checks.
6. Record final proof.
7. Prepare clean commits in gate order if you ask me to commit.

You still need to do:

- final browser walkthrough after OAuth/email work is complete;
- any GitHub workflow proof if it requires your GitHub browser/session;
- production/deployment admin decisions, if any.

## Recommended Order

1. G10 is committed as `d97ffdb`.
2. Finish and verify G11.
3. Then finish and verify G12.
4. Scheduled scraping is now enabled; confirm the first automatic run after it fires.

## GitHub Actions Scrape Setup

Current scrape workflow:

```yaml
on:
  schedule:
    - cron: "0 3 * * *"
  workflow_dispatch:
```

This means the scraper runs daily at `03:00 UTC`, and can still be run manually from the GitHub Actions tab.

## Cost And Limits

Daily scraping is expected to be very small:

- The proven GitHub run took about 1 minute 40 seconds.
- One daily run is roughly 50 GitHub Actions minutes per month.
- Public repositories can use standard GitHub-hosted runners for free.
- Private repositories have included monthly minutes before billing; check the GitHub billing page if the repo is private or the cadence is increased.
- Supabase impact should be small: six `scrape_runs` rows per day plus mostly skipped/updated funding rows after the first seed.

Cost risk appears only if the project exceeds GitHub Actions/Supabase quotas, if larger runners are used, or if the schedule is changed from daily to frequent scraping.

## Cron Proof Checklist

Cron was enabled after:

1. local dry-run returns real rows; `[done]`
2. real Supabase ingestion succeeds; `[done]`
3. one manual GitHub workflow run succeeds; `[done]`
4. `scrape_runs` records sane counts in the GitHub-run context; `[done]`
5. first scheduled GitHub run succeeds; `[pending]`

## Immediate Next Step

Finish the remaining manual/admin proof: OAuth, email magic-link, browser walkthrough, and first scheduled cron run.
