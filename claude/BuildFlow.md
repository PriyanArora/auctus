# Auctus AI — Build Flow

A phase is done when the checkpoint passes, not when the code is written.

---

## Prerequisites

- Node.js 20+ (runtime)
- npm (package manager)
- Git (version control)
- VS Code with TypeScript + Tailwind CSS IntelliSense extensions

**Do NOT install until needed:**
- PostgreSQL + Prisma CLI — Phase 9
- Docker — Phase 11
- GitHub Actions — Phase 12
- Vercel CLI — Phase 14
- Playwright — Phase 13

---

## Global Rules (All Phases)

- **Branching:** `feat/<phase>/<description>` — never commit to main directly for features
- **Commits:** `<type>(<scope>): <description>` — imperative, present tense, <72 chars
- **Secrets:** Never in git. Env guard on every required var.
- **Errors:** Every error path handled. No silent swallowing.
- **Testing:** Every phase checkpoint requires its tests verified.
- **TypeScript:** No `any` types. Use `unknown` and narrow, or define interfaces.
- **Data access:** Always through `lib/data-utils.ts` — components never import JSON directly.
- **Client/server boundary:** Mark components `'use client'` only when they use hooks or browser APIs.
- **Accessibility:** All interactive elements must be keyboard accessible with ARIA labels.

---

## PHASE 1 — Project Scaffold [complete]

**Goal:** Next.js project builds and runs with zero errors, base config in place.

**Tasks:**
- Initialize Next.js project with TypeScript and App Router
- Configure Tailwind CSS 4 via PostCSS
- Set up ESLint with Next.js config
- Configure TypeScript strict mode and path aliases
- Set up `.gitignore` for Node.js/Next.js
- Verify `npm run dev`, `npm run build`, and `npm run lint` all pass

**Checkpoint:**
- [x] `npm run build` succeeds with zero errors
- [x] `npm run dev` starts dev server on localhost:3000
- [x] `npm run lint` passes with no warnings
- [x] TypeScript strict mode enabled in tsconfig.json
- [x] Tailwind CSS classes render correctly
- [x] Commit: `chore(config): initialize Next.js project with TypeScript and Tailwind`

---

## PHASE 2 — Layout & Navigation [complete]

**Goal:** App shell with responsive Navbar, Footer, and page routing works on all screen sizes.

**Tasks:**
- Create Navbar component with navigation links and business switcher
- Create Footer component
- Set up root layout with Navbar, Footer, and error boundary
- Create Providers wrapper for context providers
- Add responsive design for mobile and desktop
- Create base UI components: Button, Card, Badge, Input

**Checkpoint:**
- [x] Navbar renders with all navigation links
- [x] Business switcher dropdown works
- [x] Footer renders on all pages
- [x] Mobile responsive layout (hamburger menu or collapsible nav)
- [x] ErrorBoundary catches and displays errors gracefully
- [x] All routes navigate without full page reload
- [x] Commit: `feat(ui): add layout shell with Navbar, Footer, and routing`

---

## PHASE 3 — Static Data Layer [complete]

**Goal:** All JSON data files created with type definitions and centralized access functions.

**Tasks:**
- Create JSON data files: businesses, grants, threads, replies, matches, jobs, talents
- Define TypeScript interfaces for all data models in data-utils.ts
- Create data access functions (getAll, getById, filter) for each model
- Implement grant matching algorithm with weighted scoring
- Create BusinessContext for global business state
- Create ToastContext for notification system

**Checkpoint:**
- [x] All 7 JSON data files contain realistic demo data
- [x] TypeScript interfaces match JSON structure exactly
- [x] `getAllGrants()`, `getBusinessById()`, etc. return typed data
- [x] `calculateGrantMatch()` returns scores 0-100 for any business/grant pair
- [x] BusinessContext provides and updates active business across pages
- [x] ToastContext shows success/error/info/warning notifications
- [x] Commit: `feat(db): add static data layer with type-safe access functions`

---

## PHASE 4 — Grant Discovery [complete]

**Goal:** Grants page shows all grants with match scores, filtering, and detail view.

**Tasks:**
- Build Grants listing page with GrantCard components
- Implement filtering by category, amount range, deadline, match score
- Add match percentage display with color coding
- Build Grant detail page with full eligibility breakdown
- Add deadline countdown display
- Add search functionality

**Checkpoint:**
- [x] Grants page loads and displays all 30 grants
- [x] Match scores display correctly for the active business
- [x] Filtering by category, amount, and match score works
- [x] Grant detail page shows eligibility breakdown
- [x] Deadline countdown shows days remaining
- [x] Color coding: green >80%, yellow 60-80%, gray <60%
- [x] Commit: `feat(grants): add grant discovery with matching and filtering`

---

## PHASE 5 — Community Forum [complete]

**Goal:** Forum listing, thread detail, and new thread creation work with categories and search.

**Tasks:**
- Build Forum listing page with ThreadCard components
- Implement 6 forum categories with filtering
- Add search by title, content, and tags
- Build Thread detail page with ReplyCard components
- Build New Thread creation form
- Add sort options: Most Recent, Most Replies, Most Helpful

**Checkpoint:**
- [x] Forum page lists all 18 threads grouped by category
- [x] Category filter shows correct thread count
- [x] Search filters threads by title, content, and tags
- [x] Thread detail shows thread content and all replies
- [x] New thread form creates a thread (client-side)
- [x] Sort options reorder threads correctly
- [x] Commit: `feat(forum): add community forum with categories and search`

---

## PHASE 6 — Business Matchmaking [complete]

**Goal:** Matchmaker shows scored business matches with reasoning and filtering tabs.

**Tasks:**
- Build Matchmaker page with MatchCard components
- Implement matching algorithm based on needs/offers overlap
- Add 4 filter tabs: All, You Need/They Offer, You Offer/They Need, Mutual
- Display match score with detailed reasoning breakdown
- Show complementary needs and offers analysis

**Checkpoint:**
- [x] Matchmaker page displays all matching businesses
- [x] Match scores calculate correctly from needs/offers overlap
- [x] 4 filter tabs show correct subsets
- [x] MatchCard shows reasoning with youNeed, theyOffer, mutualBenefits
- [x] Switching business in context updates all matches
- [x] Commit: `feat(matchmaker): add business matchmaking with scoring`

---

## PHASE 7 — Dashboard, AI Chatbot & Talent [complete]

**Goal:** Dashboard shows business overview, AI chatbot provides contextual advice, talent marketplace works.

**Tasks:**
- Build Dashboard page with StatsCards and quick action links
- Build AI Chatbot with context-aware responses
- Implement 8+ query handlers in ai-responses.ts
- Add chatbot suggestion cards and quick actions
- Build Talent marketplace with dual view (hiring/looking for work)
- Add skill-based and job-type filtering for talent

**Checkpoint:**
- [x] Dashboard displays business stats and quick actions
- [x] AI Chatbot opens/closes and accepts messages
- [x] Chatbot responds contextually based on current page and business
- [x] Suggestion cards navigate to relevant pages
- [x] Talent page shows jobs and talent profiles
- [x] Filtering by skills and job type works
- [x] Chatbot is dynamically imported (not in initial bundle)
- [x] Commit: `feat(dashboard): add dashboard, AI chatbot, and talent marketplace`

---

## PHASE 8 — Backend API Setup

**Goal:** Next.js API routes serve all data currently loaded from static JSON, with proper error handling and validation.

**Tasks:**
- Create API route structure under `app/api/`
- Implement `GET /api/grants` with query param filtering
- Implement `GET /api/grants/:id` for grant detail
- Implement `GET /api/grants/match/:businessId` for match scores
- Implement `GET /api/businesses` and `GET /api/businesses/:id`
- Implement `GET /api/forum/threads` with category/sort params
- Implement `GET /api/forum/threads/:id` with replies
- Implement `GET /api/talent/jobs` and `GET /api/talent/profiles`
- Add input validation on all route params and query strings
- Add consistent error response format: `{ error: string, status: number }`
- Create `.env.example` with placeholder values

**Checkpoint:**
- [ ] `GET /api/grants` returns JSON array of grants
- [ ] `GET /api/grants?category=Technology` filters correctly
- [ ] `GET /api/grants/grant-001` returns single grant
- [ ] `GET /api/businesses` returns all businesses
- [ ] `GET /api/forum/threads?sort=recent` returns sorted threads
- [ ] Invalid route params return 400 with error message
- [ ] Non-existent IDs return 404 with error message
- [ ] `.env.example` exists with documented variables
- [ ] All API routes return proper Content-Type headers
- [ ] Commit: `feat(api): add REST API routes for all data endpoints`

---

## PHASE 9 — Database Integration

**Goal:** PostgreSQL replaces static JSON. All data persisted, schema migrated, seed data loaded.

**Tasks:**
- Install Prisma and initialize with PostgreSQL provider
- Design database schema matching existing TypeScript interfaces
- Create initial migration from schema
- Write seed script that imports all JSON data into database
- Update data-utils.ts to use Prisma client instead of JSON imports
- Add database connection env guard
- Update API routes to query database through Prisma

**Checkpoint:**
- [ ] `npx prisma migrate dev` runs without errors
- [ ] `npx prisma db seed` populates all tables with demo data
- [ ] `SELECT count(*) FROM grants` returns 30
- [ ] `SELECT count(*) FROM businesses` returns 7
- [ ] All API routes return same data as before (regression check)
- [ ] Database connection failure shows helpful error, not crash
- [ ] `DATABASE_URL` is in `.env.example` but not in git
- [ ] Commit: `feat(db): integrate PostgreSQL with Prisma ORM`

---

## PHASE 10 — Authentication

**Goal:** Users can register, login, and access protected routes. Sessions use httpOnly cookies.

**Tasks:**
- Install and configure NextAuth.js (or custom JWT auth)
- Create User model in Prisma schema and migrate
- Implement `POST /api/auth/register` with password hashing (bcrypt)
- Implement `POST /api/auth/login` returning JWT in httpOnly cookie
- Implement `POST /api/auth/logout` clearing session
- Implement `GET /api/auth/me` for current user
- Create auth middleware for protected API routes
- Build login and register pages
- Add auth state to client (logged in/out UI changes)
- Protect write operations: create thread, post reply, update business

**Checkpoint:**
- [ ] Register with email + password creates user in database
- [ ] Login with valid credentials sets httpOnly cookie
- [ ] Login with wrong password returns 401
- [ ] `GET /api/auth/me` returns user profile when authenticated
- [ ] `GET /api/auth/me` returns 401 when not authenticated
- [ ] `POST /api/forum/threads` requires authentication (returns 403 without)
- [ ] Password is bcrypt-hashed in database (not plaintext)
- [ ] Navbar shows login/logout based on auth state
- [ ] Commit: `feat(auth): add authentication with JWT and httpOnly cookies`

---

## PHASE 11 — API Migration

**Goal:** Frontend pages fetch from API routes instead of importing static JSON. All pages work identically.

**Tasks:**
- Create API client utility with fetch wrapper and error handling
- Replace JSON imports in grant discovery page with API calls
- Replace JSON imports in forum pages with API calls
- Replace JSON imports in matchmaker page with API calls
- Replace JSON imports in talent page with API calls
- Replace JSON imports in dashboard page with API calls
- Add loading states (Skeleton components) during data fetch
- Add error states when API calls fail
- Implement `POST` endpoints for forum thread/reply creation
- Implement `PUT /api/businesses/:id` for profile updates

**Checkpoint:**
- [ ] Grants page loads data from `/api/grants` (verify in Network tab)
- [ ] Forum page loads from `/api/forum/threads`
- [ ] Matchmaker loads from `/api/businesses` + `/api/grants/match`
- [ ] Creating a forum thread persists to database
- [ ] Posting a reply persists to database
- [ ] Loading skeletons show during data fetch
- [ ] API failure shows error message, not broken page
- [ ] No static JSON imports remain in page components
- [ ] Commit: `feat(api): migrate all pages from static JSON to API calls`

---

## PHASE 12 — Real-time & Notifications

**Goal:** Forum updates in real-time, toast notifications fire on key actions, live data refresh.

**Tasks:**
- Add real-time forum updates (Server-Sent Events or WebSocket)
- Implement toast notifications for: new reply, grant deadline approaching, match found
- Add optimistic UI updates for forum posts and replies
- Implement auto-refresh for grant deadlines
- Add notification preferences (which notifications to show)
- Implement "new replies" indicator on forum threads

**Checkpoint:**
- [ ] New forum reply appears without page refresh
- [ ] Toast notification shows when a reply is posted
- [ ] Grant deadline warning toast fires for grants expiring within 7 days
- [ ] Optimistic UI: reply appears instantly, rolls back on API failure
- [ ] "New replies" badge shows on threads with unread replies
- [ ] Real-time connection reconnects after disconnect
- [ ] Commit: `feat(forum): add real-time updates and notifications`

---

## PHASE 13 — Testing & Quality

**Goal:** Unit tests cover core logic, integration tests cover API routes, CI pipeline runs on every push.

**Tasks:**
- Install and configure Vitest
- Write unit tests for `calculateGrantMatch()` — all scoring branches
- Write unit tests for `matchBusinesses()` — needs/offers overlap
- Write unit tests for `filterGrants()` — all filter combinations
- Write unit tests for input validation functions
- Write integration tests for grant API routes
- Write integration tests for auth flow (register → login → protected route)
- Write integration tests for forum CRUD
- Set up GitHub Actions CI: lint, typecheck, test on every push
- Add test coverage reporting

**Checkpoint:**
- [ ] `npm run test` passes with zero failures
- [ ] `calculateGrantMatch` tests cover: perfect match, zero match, partial match, edge cases
- [ ] Auth integration tests cover: register, login, invalid credentials, protected routes
- [ ] Forum integration tests cover: create thread, add reply, list with filters
- [ ] GitHub Actions workflow runs lint + typecheck + test on push
- [ ] Test coverage > 70% on `lib/` directory
- [ ] CI badge added to README
- [ ] Commit: `test(core): add unit and integration tests with CI pipeline`

---

## PHASE 14 — Deployment

**Goal:** Application deployed to production with SSL, environment variables configured, and zero downtime.

**Tasks:**
- Create Dockerfile and docker-compose.yml for local parity
- Configure Vercel project with environment variables
- Set up PostgreSQL production database (Vercel Postgres, Neon, or Supabase)
- Run Prisma migrations on production database
- Seed production database with initial data
- Configure custom domain (if applicable)
- Verify all features work in production
- Set up error tracking (Sentry or similar)

**Checkpoint:**
- [ ] `docker compose up` starts app + database locally
- [ ] Production URL loads without errors
- [ ] All API routes work on production
- [ ] Auth flow works on production (register, login, protected)
- [ ] Database contains seeded data
- [ ] Environment variables are set (not hardcoded)
- [ ] HTTPS/SSL active
- [ ] Error tracking captures and reports errors
- [ ] Commit: `ci(deploy): deploy to production with Docker and Vercel`

---

## PHASE 15 — Polish & Launch

**Goal:** Performance optimized, SEO configured, analytics added, app is production-ready.

**Tasks:**
- Run Lighthouse audit and fix performance issues
- Add meta tags and Open Graph data for SEO
- Implement proper 404 and error pages
- Add analytics (Vercel Analytics or Plausible)
- Performance: optimize images, lazy load below-fold content
- Accessibility audit: keyboard navigation, screen reader, color contrast
- Write user-facing documentation or help section
- Final review of all features end-to-end

**Checkpoint:**
- [ ] Lighthouse Performance score > 90
- [ ] Lighthouse Accessibility score > 95
- [ ] All pages have proper `<title>` and meta descriptions
- [ ] 404 page shows for non-existent routes
- [ ] Analytics tracking page views and key events
- [ ] All images use Next.js `<Image>` with proper sizing
- [ ] Keyboard navigation works on all interactive elements
- [ ] Full E2E walkthrough: register → login → browse grants → filter → view detail → forum post → match → talent search
- [ ] Commit: `chore(launch): polish UI, add SEO, analytics, and accessibility`

---

## Common Problems

| Problem | Likely Cause | Fix |
|---|---|---|
| `Module not found` error | Missing dependency or wrong import path | Run `npm install`, verify import path uses `@/` alias |
| Port 3000 already in use | Previous dev server still running | Kill process: `npx kill-port 3000` or restart terminal |
| Hydration mismatch warning | Client/server HTML differs (often date/time) | Wrap dynamic content in `useEffect` or add `suppressHydrationWarning` with comment |
| Tailwind classes not applying | Class not in Tailwind's content scan | Check `tailwind.config` content paths include your file |
| TypeScript `any` type error | Missing type definition | Define interface in data-utils.ts, never use `any` |
| `Cannot read properties of undefined` | Data not loaded yet or wrong ID | Add null check, verify data exists before accessing properties |
| Prisma client not generated | Forgot to run generate after schema change | Run `npx prisma generate` after any schema.prisma edit |
| Migration failed | Schema conflicts with existing data | Check error message, fix schema, run `npx prisma migrate reset` in dev only |
| JWT token expired | Session timeout | Implement token refresh flow, check expiry before API calls |
| CORS error in browser | API route missing headers | Next.js API routes are same-origin by default — check fetch URL is relative |
| `useContext` returns undefined | Component outside Provider | Ensure component is wrapped by the correct Provider in layout.tsx |
| Build fails but dev works | Server component using client hooks | Add `'use client'` directive to components using useState/useEffect |
| Database connection refused | PostgreSQL not running or wrong URL | Check `DATABASE_URL` in `.env`, verify PostgreSQL is running |
| Slow page load | Large component not code-split | Use `dynamic()` import for heavy components (like AIChatbot) |
| Git merge conflict in JSON | Multiple edits to data files | After Phase 9, JSON files won't change — resolve manually for now |

---
---

# ENGINEERING SPEC — V2 REBUILD (Phases TBD)

> **Status:** Ideas documented. Phases not yet assigned. User and Claude will define phases together in the next session.
> **Date written:** 2026-03-24

---

## 1. PLATFORM OVERVIEW — WHAT AUCTUS V2 BECOMES

Auctus transforms from a single-role business demo into a **multi-role Canadian funding platform** serving three audiences:

| Role | What they see | What they DON'T see |
|---|---|---|
| **Business** | Business grants (ACOA, BDC, NB gov, federal programs) | Student scholarships, professor grants |
| **Student** | Canadian scholarships (undergrad, master, PhD, college, high school) | Business grants, professor grants |
| **Professor** | Research grants (NSERC, SSHRC, CIHR, CFI, Mitacs, etc.) | Business grants, student scholarships |

Each role gets:
- Their own **funding page** (same UI component, different data + filters)
- Their own **dashboard** with role-specific stats
- Their own **landing page** experience after login
- **Content isolation** — routes and API enforce that you only see your role's data

---

## 2. USER FLOW — END TO END

### 2.1 First-time visitor (not logged in)

```
User visits auctus.vercel.app
        │
        ▼
┌─────────────────────────────────────┐
│       Generic Landing Page           │
│                                      │
│   "Find funding that fits you"       │
│                                      │
│   ┌───────────┐ ┌────────┐ ┌──────┐ │
│   │ I'm a     │ │ I'm a  │ │ I'm a│ │
│   │ Business  │ │ Student│ │ Prof │ │
│   └─────┬─────┘ └───┬────┘ └──┬───┘ │
│         │            │         │      │
└─────────┼────────────┼─────────┼──────┘
          │            │         │
          ▼            ▼         ▼
    Google Sign-In (with role selection)
          │
          ▼
    Role stored in Supabase user metadata
          │
          ▼
    Redirect to role-specific dashboard
```

### 2.2 Returning visitor (has cookie/session)

```
User visits auctus.vercel.app
        │
        ▼
  Supabase checks session cookie (httpOnly, persistent)
        │
        ├── Valid session → redirect to role-specific dashboard
        │
        └── Expired/none → show generic landing page
```

### 2.3 Role-specific experience after login

**Business user:**
```
Dashboard (/dashboard)
  ├── Your matched grants (top 5 by match score)
  ├── Expiring soon (grants closing within 14 days)
  ├── Business profile summary
  └── Quick actions: Browse Grants, Forum, AI Advisor

Grants (/grants)
  ├── All business grants from scraped sources
  ├── Filters: category, amount range, deadline, match score, province
  ├── Each grant: name, provider, amount, deadline, match %, eligibility
  └── Detail page: full description, requirements, apply link

Forum (/forum) — shared across all roles
AI Chatbot — context-aware for business grants
```

**Student user:**
```
Dashboard (/dashboard)
  ├── Your matched scholarships (top 5)
  ├── Expiring soon
  ├── Profile summary (education level, field of study)
  └── Quick actions: Browse Scholarships, Forum, AI Advisor

Scholarships (/scholarships)
  ├── All student scholarships from scraped sources
  ├── Filters: education level (high school, undergrad, master, PhD),
  │   field of study, amount range, deadline, province
  ├── Each scholarship: name, provider, amount, deadline, eligibility
  └── Detail page: full description, requirements, apply link

Forum (/forum) — shared across all roles
AI Chatbot — context-aware for student scholarships
```

**Professor user:**
```
Dashboard (/dashboard)
  ├── Your matched research grants (top 5)
  ├── Expiring soon
  ├── Profile summary (research area, institution)
  └── Quick actions: Browse Research Grants, Forum, AI Advisor

Research Funding (/research-funding)
  ├── All professor/research grants from scraped sources
  ├── Filters: research area, granting council (NSERC/SSHRC/CIHR/CFI),
  │   amount range, deadline, career stage (early/mid/senior)
  ├── Each grant: name, council, amount, deadline, eligibility
  └── Detail page: full description, requirements, apply link

Forum (/forum) — shared across all roles
AI Chatbot — context-aware for research grants
```

---

## 3. DATABASE SCHEMA (Supabase / PostgreSQL)

### 3.1 Users

```sql
-- Managed by Supabase Auth (auto-created on Google sign-in)
-- We extend with a profiles table:

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('business', 'student', 'professor')),
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Role-specific profile extensions:

CREATE TABLE business_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  industry TEXT,
  location TEXT,
  revenue NUMERIC,
  employees INTEGER,
  description TEXT,
  needs TEXT[],          -- for future matchmaking if re-added
  offers TEXT[],
  year_established INTEGER,
  website TEXT
);

CREATE TABLE student_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  education_level TEXT CHECK (education_level IN ('high_school', 'college', 'undergrad', 'masters', 'phd')),
  field_of_study TEXT,
  institution TEXT,
  province TEXT,
  gpa NUMERIC,
  graduation_year INTEGER
);

CREATE TABLE professor_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  institution TEXT,
  department TEXT,
  research_area TEXT,
  career_stage TEXT CHECK (career_stage IN ('early', 'mid', 'senior', 'emeritus')),
  h_index INTEGER,
  research_keywords TEXT[]
);
```

### 3.2 Funding (unified table for all three types)

```sql
CREATE TABLE funding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Classification
  type TEXT NOT NULL CHECK (type IN ('business_grant', 'scholarship', 'research_grant')),

  -- Core fields (shared across all types)
  name TEXT NOT NULL,
  description TEXT,
  provider TEXT NOT NULL,           -- e.g., "NSERC", "Government of Canada", "ScholarshipsCanada"
  amount_min NUMERIC,               -- minimum funding amount (CAD)
  amount_max NUMERIC,               -- maximum funding amount (CAD)
  deadline TIMESTAMPTZ,             -- application deadline (NULL = rolling/ongoing)
  application_url TEXT,             -- direct link to apply
  source_url TEXT,                  -- where we scraped it from

  -- Eligibility (flexible JSONB for role-specific criteria)
  eligibility JSONB DEFAULT '{}',
  -- Business example: {"provinces": ["NB", "NS"], "revenue_under": 500000, "employees_under": 50, "industries": ["Technology", "Tourism"]}
  -- Student example: {"education_levels": ["undergrad", "masters"], "fields": ["Engineering", "Science"], "min_gpa": 3.0, "provinces": ["All"]}
  -- Professor example: {"career_stages": ["early", "mid"], "research_areas": ["Natural Sciences", "Engineering"], "councils": ["NSERC"]}

  requirements TEXT[],              -- list of application requirements
  category TEXT,                    -- broad category for filtering
  tags TEXT[],                      -- searchable tags

  -- Scraping metadata
  source TEXT NOT NULL CHECK (source IN ('scraped', 'manual')),
  scraped_from TEXT,                -- which scraper produced this (e.g., "nserc_scraper")
  scraped_at TIMESTAMPTZ,

  -- Lifecycle
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast filtering
CREATE INDEX idx_funding_type ON funding(type);
CREATE INDEX idx_funding_status ON funding(status);
CREATE INDEX idx_funding_deadline ON funding(deadline);
CREATE INDEX idx_funding_type_status ON funding(type, status);
```

### 3.3 Forum (adapted from existing)

```sql
CREATE TABLE threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id),
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[],
  views INTEGER DEFAULT 0,
  helpful INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES threads(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. SCRAPING ARCHITECTURE — FULL DETAIL

### 4.1 How it runs

```
┌──────────────────────────────────────────────────────────┐
│                   GitHub Actions                          │
│                                                          │
│  Cron: "0 3 * * *" (daily at 3:00 AM UTC)               │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │              scraper/index.ts                       │  │
│  │                                                    │  │
│  │  1. Load all scraper modules                       │  │
│  │  2. For each scraper:                              │  │
│  │     a. Fetch page(s)                               │  │
│  │     b. Parse HTML → normalize to FundingItem       │  │
│  │     c. Deduplicate against existing DB entries     │  │
│  │     d. INSERT new / UPDATE changed / skip same     │  │
│  │  3. Run expiry check:                              │  │
│  │     UPDATE funding SET status='expired'            │  │
│  │     WHERE deadline < NOW() AND status='active'     │  │
│  │  4. Log summary:                                   │  │
│  │     "NSERC: 3 new, 1 updated, 0 expired"          │  │
│  │     "ScholarshipsCanada: 12 new, 0 updated, 5 exp"│  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
          │
          │  Supabase client (direct DB connection)
          ▼
┌──────────────────┐
│  Supabase DB     │
│  funding table   │
└──────────────────┘
```

### 4.2 Scraper module pattern

Every source gets its own scraper file. All scrapers implement the same interface:

```typescript
// scraper/types.ts
interface ScrapedFunding {
  name: string;
  description: string;
  provider: string;
  amount_min: number | null;
  amount_max: number | null;
  deadline: string | null;         // ISO date or null for rolling
  application_url: string;
  source_url: string;              // the page we scraped
  type: 'business_grant' | 'scholarship' | 'research_grant';
  eligibility: Record<string, unknown>;
  requirements: string[];
  category: string;
  tags: string[];
}

interface Scraper {
  name: string;                    // e.g., "nserc"
  type: 'business_grant' | 'scholarship' | 'research_grant';
  run(): Promise<ScrapedFunding[]>;
}
```

```typescript
// scraper/sources/nserc.ts — EXAMPLE scraper
import * as cheerio from 'cheerio';

export const nsercScraper: Scraper = {
  name: 'nserc',
  type: 'research_grant',
  async run() {
    const url = 'https://www.nserc-crsng.gc.ca/Professors-Professeurs/Grants-Subs/index_eng.asp';
    const html = await fetch(url).then(r => r.text());
    const $ = cheerio.load(html);

    const grants: ScrapedFunding[] = [];

    // Parse each grant listing from the page
    // (exact selectors depend on page structure — we inspect and write per-source)
    $('.grant-listing-item').each((i, el) => {
      grants.push({
        name: $(el).find('.title').text().trim(),
        description: $(el).find('.description').text().trim(),
        provider: 'NSERC',
        amount_min: parseAmount($(el).find('.amount').text()),
        amount_max: parseAmount($(el).find('.amount').text()),
        deadline: parseDate($(el).find('.deadline').text()),
        application_url: $(el).find('a.apply').attr('href') || '',
        source_url: url,
        type: 'research_grant',
        eligibility: {
          career_stages: ['early', 'mid', 'senior'],
          research_areas: ['Natural Sciences', 'Engineering'],
          councils: ['NSERC']
        },
        requirements: [],
        category: 'Research',
        tags: ['nserc', 'research', 'natural-sciences']
      });
    });

    return grants;
  }
};
```

### 4.3 Deduplication logic

How we avoid duplicates when the same grant is scraped multiple days:

```typescript
// scraper/deduplicate.ts
async function upsertFunding(items: ScrapedFunding[], scraperName: string) {
  for (const item of items) {
    // Check if we already have this grant (match by name + provider + type)
    const existing = await supabase
      .from('funding')
      .select('id, name, description, amount_max, deadline')
      .eq('name', item.name)
      .eq('provider', item.provider)
      .eq('type', item.type)
      .single();

    if (!existing.data) {
      // NEW — insert
      await supabase.from('funding').insert({
        ...item,
        source: 'scraped',
        scraped_from: scraperName,
        scraped_at: new Date().toISOString(),
        status: 'active'
      });
    } else if (hasChanged(existing.data, item)) {
      // CHANGED — update
      await supabase.from('funding').update({
        ...item,
        scraped_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }).eq('id', existing.data.id);
    }
    // else: SAME — skip
  }
}
```

### 4.4 Auto-expiry logic

Runs at the end of every scraper run:

```typescript
// scraper/expire.ts
async function expireOutdatedFunding() {
  const { data, count } = await supabase
    .from('funding')
    .update({ status: 'expired', updated_at: new Date().toISOString() })
    .eq('status', 'active')
    .lt('deadline', new Date().toISOString())
    .select('id');

  console.log(`Expired ${count} outdated funding entries`);
}
```

### 4.5 GitHub Actions workflow

```yaml
# .github/workflows/scrape.yml
name: Scrape Funding Sources
on:
  schedule:
    - cron: '0 3 * * *'    # Daily at 3 AM UTC
  workflow_dispatch:         # Manual trigger button in GitHub UI

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci --prefix scraper
      - run: npm run scrape --prefix scraper
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
```

### 4.6 Scraping sources — initial targets

**Business grants (5 sources):**

| # | Source | URL | Method | Notes |
|---|---|---|---|---|
| 1 | Innovation Canada | innovation.canada.ca/en | cheerio | Federal business programs, well-structured HTML |
| 2 | ACOA | acoa-apeca.gc.ca | cheerio | Atlantic Canada programs, static pages |
| 3 | NB Opportunities | onbcanada.ca | cheerio | New Brunswick specific, curated list |
| 4 | BDC | bdc.ca/en/financing | cheerio | Business Development Bank programs |
| 5 | Canada Business Network | canadabusiness.ca | cheerio | Aggregator of federal/provincial programs |

**Student scholarships (5 sources):**

| # | Source | URL | Method | Notes |
|---|---|---|---|---|
| 1 | ScholarshipsCanada | scholarshipscanada.com | cheerio | Largest Canadian scholarship DB |
| 2 | Yconic | yconic.com | cheerio/puppeteer | Popular scholarship search |
| 3 | Universities Canada | univcan.ca/scholarships | cheerio | Official university scholarships |
| 4 | Government of Canada Student Aid | canada.ca/en/services/education | cheerio | Federal student programs |
| 5 | Vanier CGS | vanier.gc.ca | cheerio | Top doctoral scholarships |

**Professor/research grants (5 sources):**

| # | Source | URL | Method | Notes |
|---|---|---|---|---|
| 1 | NSERC | nserc-crsng.gc.ca | cheerio | Discovery Grants, RTI, etc. |
| 2 | SSHRC | sshrc-crsh.gc.ca | cheerio | Insight, Partnership, Talent grants |
| 3 | CIHR | cihr-irsc.gc.ca | cheerio | Health research funding |
| 4 | CFI | innovation.ca | cheerio | Infrastructure grants |
| 5 | Mitacs | mitacs.ca | cheerio | Industry-academic partnerships |

### 4.7 Scraper directory structure

```
scraper/
├── package.json              # Separate package for scraper deps (cheerio, supabase-js)
├── tsconfig.json
├── index.ts                  # Main entry — runs all scrapers + expiry
├── types.ts                  # ScrapedFunding interface, Scraper interface
├── deduplicate.ts            # Upsert logic
├── expire.ts                 # Auto-expiry logic
├── supabase.ts               # Supabase client init
├── utils.ts                  # parseAmount(), parseDate(), cleanText()
└── sources/
    ├── business/
    │   ├── innovation-canada.ts
    │   ├── acoa.ts
    │   ├── nb-opportunities.ts
    │   ├── bdc.ts
    │   └── canada-business.ts
    ├── student/
    │   ├── scholarships-canada.ts
    │   ├── yconic.ts
    │   ├── universities-canada.ts
    │   ├── gov-student-aid.ts
    │   └── vanier.ts
    └── professor/
        ├── nserc.ts
        ├── sshrc.ts
        ├── cihr.ts
        ├── cfi.ts
        └── mitacs.ts
```

---

## 5. AUTHENTICATION — FULL DETAIL

### 5.1 Auth flow with Supabase

```
User clicks "Sign in with Google"
        │
        ▼
Supabase Auth handles OAuth flow
        │
        ▼
Google returns user info (email, name, avatar)
        │
        ▼
Supabase creates entry in auth.users
        │
        ▼
Is this their first login?
        │
        ├── YES → Show role selection modal:
        │         "I am a: [Business] [Student] [Professor]"
        │         │
        │         ▼
        │         Create profiles row with selected role
        │         Create role-specific profile row (business_profiles / student_profiles / professor_profiles)
        │         Redirect to onboarding form (fill profile details)
        │
        └── NO → Read role from profiles table
                  Redirect to role-specific dashboard
```

### 5.2 Session persistence (cookies)

Supabase Auth handles this automatically:
- Sets `sb-access-token` and `sb-refresh-token` as httpOnly cookies
- Auto-refreshes expired access tokens using refresh token
- User stays logged in across browser restarts
- Session lasts until explicit logout or refresh token expires (default: 7 days, configurable)

### 5.3 Middleware for route protection

```typescript
// middleware.ts (Next.js middleware)
// Runs on every request before the page loads

export async function middleware(request: NextRequest) {
  const session = await getSupabaseSession(request);
  const path = request.nextUrl.pathname;

  // Public routes — no auth needed
  if (path === '/' || path === '/auth/callback') return;

  // No session → redirect to landing
  if (!session) return redirect('/');

  const userRole = session.user.role; // from profiles table

  // Route protection — enforce content isolation
  if (path.startsWith('/grants') && userRole !== 'business') return redirect('/dashboard');
  if (path.startsWith('/scholarships') && userRole !== 'student') return redirect('/dashboard');
  if (path.startsWith('/research-funding') && userRole !== 'professor') return redirect('/dashboard');

  // /dashboard, /forum — accessible to all authenticated users
  return next();
}
```

### 5.4 Onboarding flow (first login)

After selecting a role, user fills a brief profile:

**Business:** business name, industry, location, employee count, revenue range
**Student:** education level, field of study, institution, province, graduation year
**Professor:** institution, department, research area, career stage

This profile data powers the matching algorithm (same approach as current grant matching, but adapted per role).

---

## 6. AI CHATBOT — OPENROUTER INTEGRATION

### 6.1 How it works now (hardcoded)

Currently `lib/ai-responses.ts` has 8+ handler functions that return canned responses based on keyword matching. No actual AI.

### 6.2 How it will work (OpenRouter)

```
User sends message in chatbot
        │
        ▼
┌─────────────────────────────────────┐
│  Client: AIChatbot.tsx               │
│  POST /api/chat with:               │
│  - message: user's text              │
│  - context: current page, user role  │
│  - history: last 10 messages         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  API Route: /api/chat                │
│                                      │
│  1. Build system prompt:             │
│     - "You are Auctus AI advisor"    │
│     - User role + profile            │
│     - Current page context           │
│     - Available grants summary       │
│  2. Call OpenRouter API              │
│  3. Stream response back             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  OpenRouter API                      │
│  Model: free tier (e.g.,             │
│    mistralai/mistral-7b-instruct    │
│    or meta-llama/llama-3-8b)        │
│  Returns: streamed response          │
└─────────────────────────────────────┘
```

### 6.3 System prompt strategy

The system prompt is role-aware and context-aware:

```typescript
function buildSystemPrompt(userRole: string, currentPage: string, userProfile: any) {
  return `You are Auctus AI, a Canadian funding advisor.

The user is a ${userRole}.
${userRole === 'business' ? `Their business: ${userProfile.business_name}, ${userProfile.industry}` : ''}
${userRole === 'student' ? `Education: ${userProfile.education_level}, studying ${userProfile.field_of_study}` : ''}
${userRole === 'professor' ? `Research: ${userProfile.research_area} at ${userProfile.institution}` : ''}

They are currently on the ${currentPage} page.

Your job:
- Help them find relevant funding opportunities
- Answer questions about eligibility and application processes
- Provide specific, actionable advice
- Reference specific grants/scholarships by name when relevant
- Never recommend funding types outside their role (don't tell students about business grants)

Keep responses concise (2-3 paragraphs max). Be specific to Canadian funding.`;
}
```

### 6.4 OpenRouter specifics

- **API endpoint:** `https://openrouter.ai/api/v1/chat/completions`
- **Free models available:** Several free models rotate on OpenRouter (Mistral 7B, Llama 3 8B, etc.)
- **API key:** stored in Supabase env / Vercel env as `OPENROUTER_API_KEY`
- **Rate limiting:** implement client-side debounce + server-side rate limit per user (e.g., 20 msgs/hour)
- **Fallback:** if OpenRouter is down, fall back to the existing hardcoded responses

---

## 7. ROUTING & CONTENT ISOLATION

### 7.1 Route structure (v2)

```
/                          → Generic landing page (not logged in)
/                          → Role-specific landing (logged in, redirect to /dashboard)
/auth/callback             → Supabase OAuth callback handler
/onboarding                → First-login profile setup

/dashboard                 → Role-specific dashboard (all roles, different content)

/grants                    → Business grants (business role only)
/grants/[id]               → Business grant detail
/scholarships              → Student scholarships (student role only)
/scholarships/[id]         → Scholarship detail
/research-funding          → Professor grants (professor role only)
/research-funding/[id]     → Research grant detail

/forum                     → Community forum (all roles)
/forum/[threadId]          → Thread detail
/forum/new                 → Create thread

/talent                    → Talent marketplace (deferred/optional)
/profile                   → User profile settings
```

### 7.2 Shared FundingPage component

One component serves all three funding pages:

```typescript
// components/FundingPage.tsx

interface FundingPageProps {
  type: 'business_grant' | 'scholarship' | 'research_grant';
  title: string;           // "Business Grants" | "Scholarships" | "Research Funding"
  filters: FilterConfig[]; // Role-specific filters
}

// /grants/page.tsx
<FundingPage
  type="business_grant"
  title="Business Grants"
  filters={[
    { key: 'category', label: 'Category', options: ['Technology', 'Tourism', 'Manufacturing', ...] },
    { key: 'province', label: 'Province', options: ['NB', 'NS', 'PE', 'NL', 'All'] },
    { key: 'amount', label: 'Amount', type: 'range' },
    { key: 'deadline', label: 'Deadline', type: 'date' },
    { key: 'match_score', label: 'Match Score', type: 'range' }
  ]}
/>

// /scholarships/page.tsx
<FundingPage
  type="scholarship"
  title="Scholarships"
  filters={[
    { key: 'education_level', label: 'Level', options: ['High School', 'College', 'Undergrad', 'Masters', 'PhD'] },
    { key: 'field_of_study', label: 'Field', options: ['Engineering', 'Science', 'Arts', 'Business', ...] },
    { key: 'amount', label: 'Amount', type: 'range' },
    { key: 'deadline', label: 'Deadline', type: 'date' },
    { key: 'province', label: 'Province', options: [...] }
  ]}
/>

// /research-funding/page.tsx
<FundingPage
  type="research_grant"
  title="Research Funding"
  filters={[
    { key: 'council', label: 'Granting Council', options: ['NSERC', 'SSHRC', 'CIHR', 'CFI', 'Mitacs', 'Other'] },
    { key: 'research_area', label: 'Research Area', options: ['Natural Sciences', 'Engineering', 'Health', 'Social Sciences', ...] },
    { key: 'career_stage', label: 'Career Stage', options: ['Early', 'Mid', 'Senior'] },
    { key: 'amount', label: 'Amount', type: 'range' },
    { key: 'deadline', label: 'Deadline', type: 'date' }
  ]}
/>
```

### 7.3 Navbar changes per role

```
Business:  Dashboard | Grants     | Forum | AI Advisor | Profile
Student:   Dashboard | Scholarships | Forum | AI Advisor | Profile
Professor: Dashboard | Research Funding | Forum | AI Advisor | Profile
```

Matchmaker link removed. Talent link removed (or shown as "beta" if we keep it).

---

## 8. LANDING PAGE — ROLE-SPECIFIC

### 8.1 Before login (generic)

```
Hero: "Find Canadian funding that fits you"
Subtext: "Grants for businesses. Scholarships for students. Research funding for professors."

Three cards:
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   🏢 Business    │  │   🎓 Student     │  │   🔬 Professor   │
│                   │  │                   │  │                   │
│ "Discover grants  │  │ "Find scholar-   │  │ "Access research  │
│  matched to your  │  │  ships for your   │  │  grants from      │
│  business"        │  │  education level" │  │  NSERC, SSHRC..." │
│                   │  │                   │  │                   │
│  [Get Started]    │  │  [Get Started]    │  │  [Get Started]    │
└─────────────────┘  └─────────────────┘  └─────────────────┘

Stats bar: "500+ grants tracked | Updated daily | 100% free"

How it works:
1. Sign in with Google
2. Tell us your role
3. Get matched funding
```

### 8.2 After login (role-specific)

Each role gets a different hero section, different featured funding, and different CTAs. The dashboard serves as the post-login landing.

---

## 9. WHAT GETS REMOVED

### 9.1 Matchmaker page
- Delete `app/matchmaker/page.tsx`
- Delete `components/cards/MatchCard.tsx`
- Remove matchmaker data from `data/matches.json`
- Remove matchmaker link from Navbar
- Remove matchmaker references from AI chatbot responses
- Remove Match interface from data-utils.ts (or keep for future)

### 9.2 Static JSON data (after DB migration)
- `data/businesses.json` → migrated to Supabase `business_profiles`
- `data/grants.json` → migrated to Supabase `funding` table
- `data/threads.json` → migrated to Supabase `threads` table
- `data/replies.json` → migrated to Supabase `replies` table
- `data/matches.json` → deleted (matchmaker removed)
- `data/jobs.json` → kept as static for now (talent page deferred)
- `data/talents.json` → kept as static for now

### 9.3 Hardcoded AI responses
- `lib/ai-responses.ts` → replaced by OpenRouter API call
- Keep as fallback module in case OpenRouter is down

---

## 10. MATCHING ALGORITHM — ADAPTED PER ROLE

The current `calculateGrantMatch()` works for businesses. We need equivalent logic for students and professors:

### Business match (existing, adapted)
```
Score based on:
- Province match (25 pts)
- Revenue threshold (25 pts)
- Employee count (20 pts)
- Industry match (30 pts)
```

### Student match (new)
```
Score based on:
- Education level match (30 pts) — grant requires undergrad, student is undergrad
- Field of study match (25 pts) — grant is for Engineering, student studies Engineering
- Province match (15 pts) — some scholarships are province-specific
- GPA threshold (15 pts) — if grant has min GPA requirement
- Citizenship/residency (15 pts) — Canadian citizen/PR
```

### Professor match (new)
```
Score based on:
- Research area match (30 pts) — grant is for Natural Sciences, prof does Physics
- Career stage match (25 pts) — grant is for early-career, prof is early-career
- Council alignment (20 pts) — NSERC grant, prof's work is NSERC-eligible
- Institution eligibility (15 pts) — some grants are for specific institution types
- Past funding (10 pts) — some grants prefer/exclude previous recipients
```

---

## 11. ENVIRONMENT VARIABLES (COMPLETE LIST)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key          # Server-only, never exposed to client

# OpenRouter (AI Chatbot)
OPENROUTER_API_KEY=your-openrouter-api-key          # Server-only

# Scraper (GitHub Actions only)
SUPABASE_URL=https://your-project.supabase.co       # Same as above, used in scraper context
SUPABASE_SERVICE_KEY=your-service-key               # Same as service role key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000            # Or production URL
NODE_ENV=development
```

---

## 12. TALENT PAGE — DEFERRED

Current state: cards and buttons are non-functional prototypes. Decision: **keep as-is, mark as "Coming Soon" in the UI.** Do not invest time until core features (auth, funding pages, scraping) are solid.

If we revisit later:
- Connect to real job board APIs (Indeed, LinkedIn)
- Allow businesses to post jobs through Auctus
- Allow students to create talent profiles
- Match students with jobs based on skills

---

## 13. OPEN QUESTIONS (to resolve when building phases)

1. **Forum visibility** — currently shared across all roles. Keep shared, or add role-specific categories?
2. **Admin interface** — do we need a way to manually add/edit/delete grants through a UI? Or is database direct access enough for now?
3. **Email notifications** — "New scholarship matching your profile" emails? Or out of scope for v2?
4. **Mobile responsiveness** — current frontend is responsive. New pages should maintain that.
5. **Rate limiting on scraping** — how aggressive? Recommend 1 request per 2 seconds per source to be polite.
6. **Scraper error handling** — if one source fails, should the whole job fail or continue with others? Recommend: continue, log the failure, alert via GitHub Actions notification.
