# Claude Guide — Auctus AI

---

## The Developer

Building a multi-role Canadian funding platform — a significant full-stack project spanning frontend UI, Supabase backend, Google authentication, web scraping pipelines, and AI integration. The frontend v1 is complete: 9 pages, 25+ components, grant matching, AI chatbot, and forum. The v2 growth arc transforms this from a single-role business demo into a three-role platform (business, student, professor) with real data from scraped sources, Supabase database, Google OAuth, role-based content isolation, and an OpenRouter-powered AI chatbot. By project end, the developer will have built a production SaaS platform with automated data pipelines, multi-tenant auth, and real AI integration.

---

## Response Structure

Three rules:

1. **Code directly, explain briefly.** Write implementation code when the task is clear. Explain decisions only when the reasoning isn't obvious from the code. No hand-holding, no step-by-step walkthroughs unless explicitly asked.

2. **Enforce habits inline.** Name variables correctly, format commits, add structured logs, show error patterns. If the code violates a habit, fix it immediately — don't just flag it.

3. **End with next action + verification.** Smallest running increment. What to run. Expected result. Exact commit message.

---

## The 13 Habits

### H1 — Walking Skeleton First
Get something running end-to-end before building depth. A button that does one thing through every layer beats a perfect architecture with zero working code.

### H2 — Build Vertically, Not Horizontally
One complete feature through every layer before the next. Don't build all routes before proving one works end-to-end.

### H3 — Conventional Commits
`<type>(<scope>): <description>`. Imperative, present tense, <72 chars.

**Types:** feat, fix, chore, test, refactor, docs, ci, perf

**Scopes:** ui, api, db, auth, grants, scholarships, research, forum, chatbot, dashboard, scraper, landing, profile, config, build, ci, deploy

### H4 — Test First on Core Logic
Pure functions with clear I/O: write test before implementation. Red → Green → Refactor.

**Priority TDD targets:**
- `calculateFundingMatch(profile, funding) → number` — eligibility scoring (works for all 3 roles)
- `filterFunding(items, filters) → FundingItem[]` — funding filtering with role-specific criteria
- `parseDeadline(dateString) → { daysLeft, isExpired }` — deadline countdown logic
- `sanitizeForumPost(content) → string` — forum content sanitization
- `deduplicateFunding(scraped, existing) → { new, updated, unchanged }` — scraper deduplication
- `expireFunding(items, now) → FundingItem[]` — auto-expiry logic
- `buildSystemPrompt(role, page, profile) → string` — AI chatbot prompt construction
- `validateProfile(role, data) → ValidationResult` — onboarding profile validation

### H5 — Clean Code: Names, Functions, Errors
Names describe what a thing is. Functions do one thing. Errors always use proper error patterns:

```typescript
throw new Error('[Scraper] Failed to fetch NSERC grants page', { cause: error });
```
```typescript
throw new Error('[Auth] Google OAuth callback failed — missing user email', { cause: error });
```
```typescript
throw new Error('[API] Funding query failed for type: scholarship', { cause: error });
```

### H6 — YAGNI / KISS / DRY
Build what the current phase needs. No "we might need this later" abstractions. One working feature is better than a clever framework with zero working features.

### H7 — Refactor in a Separate Commit
Never mix refactor and feature in the same commit. If you notice something needs reshaping mid-feature, finish the feature, commit, then refactor and commit separately.

### H8 — DevOps Incrementally
- `.gitignore` + branching: day one (done)
- Build config, Next.js scaffold: Phase 1-2 (done)
- Supabase project + env variables: when DB phase begins
- GitHub Actions scraper cron: when scraper phase begins
- GitHub Actions CI (lint + test): when testing phase begins
- Vercel production deployment: already connected, production config when ready
- Monitoring + analytics: final phase

### H9 — Structured Logging
Use `console.log` sparingly for dev only. For production paths, use structured JSON logging with context:

```typescript
// Development
console.log('[Scraper:NSERC] Found grants:', { count: 12, new: 3, updated: 1 });

// Production (when needed — use pino)
import pino from 'pino';
const logger = pino({ level: 'info' });
logger.info({ source: 'nserc', count: 12, new: 3 }, 'Scraper run complete');
```

Use structured logging for: scraper runs (source, count, new/updated/expired), auth events (login, role selection), API requests, database queries, chatbot interactions, error paths.

### H10 — Document the Why
Comments explain decisions, not code. Examples of good comments:
```typescript
// Unified funding table with JSONB eligibility instead of 3 separate tables — same UI component serves all roles
// OpenRouter free tier rotates models — always check available models, fall back to hardcoded responses if API down
// Scraper deduplicates by name+provider+type composite — application_url alone isn't reliable (changes between cycles)
```

### H11 — Debug With Method
Reproduce reliably → state hypothesis → test one variable → read full error top to bottom → rubber duck at 30 min. Primary tools: Chrome DevTools (frontend), Next.js error overlay (dev server), Supabase dashboard (database queries), GitHub Actions logs (scraper debugging).

### H12 — Small Working Progress Daily
Every session produces something that runs. Never end a session with broken code on the working branch.

### H13 — Test at Every Seam (Most Important)
Three categories — never interchangeable:

- **Unit (Vitest):** pure functions — `calculateFundingMatch`, `filterFunding`, `deduplicateFunding`, `expireFunding`, `parseDeadline`, `buildSystemPrompt`, `validateProfile`
- **Integration (Vitest + Supabase test project):** API routes through middleware, Supabase queries, auth flow (Google OAuth mock), scraper against saved HTML fixtures
- **E2E (manual for v1, Playwright later):** full user flows — Google login → role selection → onboarding → browse funding → filter → view detail → forum post → AI chat

---

## Specific Situations

### "How do I start Phase X?"
Read `claude/BuildFlow.md` for that phase. Identify the smallest slice that produces a running result. Build that slice first.

### Code review
Check against habits H3, H5, H6, H7, H13 in order. Flag the first violation. Fix one habit at a time.

### Error shared
Read the full error. State what it means. Fix it. If the fix requires understanding the user's intent, ask one clarifying question.

### Skipping tests
Block the phase. No phase passes without its tests verified.

### Working ahead
Stop. Ask: "Is the current phase fully working and committed?" If not, redirect.

### YAGNI violation
Ask: "Which phase needs this?" If it's not in the current phase, remove it.

### Static data → Supabase migration
When replacing JSON imports with Supabase queries: change one data source at a time. Keep the old import as fallback until the Supabase query is verified working. Never migrate all data sources in one commit.

### Database schema change mid-feature
Stop the feature work. Write the migration as a separate commit (`chore(db): add column X to table Y`). Run it in Supabase dashboard. Verify. Then resume the feature.

### Next.js hydration mismatch
Check for `typeof window` guards, `useEffect` for client-only code, and `suppressHydrationWarning` only as a last resort. Never suppress without commenting why.

### Component re-renders causing stale data
Check `useCallback`/`useMemo` dependencies. Verify Context isn't triggering unnecessary re-renders. Profile with React DevTools before optimizing.

### Scraper returns empty results
Check if the source site changed its HTML structure. Compare against saved HTML fixture. Log the raw HTML response for debugging. Never silently insert 0 results — always alert.

### Supabase Row Level Security (RLS) blocking queries
Check RLS policies in Supabase dashboard. Ensure the correct key is used (anon key for client, service role key for server/scraper). Never disable RLS — fix the policy.

### OpenRouter API returns error or empty response
Fall back to hardcoded responses from `lib/ai-responses.ts`. Log the error. Never show the raw API error to the user.

### Role-based route access denied
Check middleware.ts logic. Verify the user's role is correctly stored in profiles table. Check Supabase session is being read correctly in middleware.

---

## Red Lines — Never Do These

- Never write vague commit messages like "update code" or "fix stuff"
- Never hardcode secrets — always environment variables with guards
- Never let a phase pass without its tests verified
- Never skip error handling — every error path must be handled
- Never use `any` type in TypeScript — use `unknown` and narrow, or define a proper interface
- Never store auth tokens in localStorage — Supabase handles httpOnly cookies
- Never query Supabase directly from client components without RLS — always use anon key with proper policies or go through API routes
- Never mutate state directly — always use setter functions or immutable patterns
- Never commit `.env` or `.env.local` files to git — only `.env.example` with placeholder values
- Never use `dangerouslySetInnerHTML` without sanitization — XSS vector
- Never bypass Next.js data fetching patterns (use server components, `fetch` with caching)
- Never import server-only code in client components — use `'use server'` / `'use client'` boundaries correctly
- Never disable ESLint rules inline without a comment explaining why
- Never use `suppressHydrationWarning` as a fix — it's a mask, not a solution (except on `<html>` and `<body>` for theme providers)
- Never expose Supabase service role key to the client — it bypasses RLS
- Never trust client-side validation alone — always validate on the server
- Never show one role's funding data to another role — middleware must enforce isolation
- Never let a scraper run without error handling per source — one failed source must not crash the entire run
- Never scrape without rate limiting — minimum 1-2 second delay between requests to the same domain
- Never store scraped HTML in the database — only the extracted, normalized data

---

## Phase Awareness

> **V2 phases are being defined.** The table below shows v1 completed phases and the planned v2 direction. Exact v2 phase breakdown will be finalized in the next session. See `BuildFlow.md` engineering spec for full v2 details.

| Phase | Status | Working |
|---|---|---|
| 1 — Scaffold | complete | Build config, project structure, dev server, linting |
| 2 — Layout & Navigation | complete | Navbar, Footer, routing, responsive shell |
| 3 — Static Data Layer | complete | JSON data files, type definitions, data access functions |
| 4 — Grant Discovery | complete | Grants page, filtering, matching algorithm, grant detail |
| 5 — Community Forum | complete | Forum listing, thread detail, categories, search |
| 6 — Business Matchmaking | complete | Match algorithm, match cards, filtering tabs (TO BE REMOVED in v2) |
| 7 — Dashboard & AI Chatbot | complete | Dashboard stats, AI advisor, talent marketplace |
| V2 — TBD | planned | Supabase DB, Google auth (3 roles), scholarships page, professor grants page, scraping pipelines, OpenRouter chatbot, role-specific landing/dashboard, remove matchmaker, content isolation |
