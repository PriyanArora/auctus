# Auctus

Auctus is a web product in development for Canadian funding discovery.

The goal of V2 is to support three user types from the start:

1. businesses looking for grants and support programs
2. students looking for scholarships and related funding
3. professors looking for research funding

## Current Status

The current repository is still in transition.

Right now, the codebase is closer to a frontend demo shell than a finished product. The V2 work introduces real authentication, real persistence, a unified funding model, a forum, and an ETL pipeline for funding data.

The planning and execution docs for that work live in the [`build/`](build) folder.

## Tech Stack

The current application uses:

1. Next.js 16
2. React 19
3. TypeScript 5
4. Tailwind CSS 4
5. ESLint 9

The planned V2 platform adds:

1. Supabase for auth, database, and row level security
2. GitHub Actions for CI and ETL runs
3. a separate `scraper/` package for ingestion
4. Vitest for test coverage

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Important Project Docs

If you are trying to understand the project, start here:

1. [`build/productvision.md`](build/productvision.md)  
   Full project context, product direction, architecture, and pending decisions.

2. [`build/gameplan.md`](build/gameplan.md)  
   The committed V2 scope.

3. [`build/shared/buildflow.md`](build/shared/buildflow.md)  
   The master phase tracker for the two developer workflow.

4. [`build/shared/ownership.md`](build/shared/ownership.md)  
   Folder, route, migration, and domain ownership.

5. [`claude/ProjectSummary.md`](claude/ProjectSummary.md)  
   Broader product vision and architectural intent.

## Repository Notes

The `build/` folder is the active planning and execution layer for V2.

The `claude/` folder contains earlier project context and legacy planning material.

The existing app still contains demo era code and content. V2 is the effort to move that into a real multi role product with clear domain boundaries.
