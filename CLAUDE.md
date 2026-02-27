# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This repo contains **four design variants** of a mini PC e-commerce storefront (minicomputer.cz), each a self-contained full-stack app:

| Directory | Design Concept | Dev Port |
|-----------|---------------|----------|
| `Asset-Manager/` | Primary bento/cyberpunk dark theme | 5001 |
| `Attached-Assets/` | Landing page variant | 5002 |
| `Mini-Computer-Shop-2/` | Scroll-animated with Lenis + Zustand | 5003 |
| `Modern-Eshop/` | Light/clean corporate (GESEURO brand) | 5004 |

All four share the same stack and `package.json` structure.

## Commands

Run from within any project directory (e.g. `cd Asset-Manager`):

```bash
npm run dev          # Start Express backend (tsx, NODE_ENV=development)
npm run dev:client   # Start Vite frontend on port 5000
npm run build        # Build → dist/public/ (Vite) + dist/index.cjs (server)
npm run start        # Run production build
npm run check        # TypeScript type check (no emit)
npm run db:push      # Push Drizzle schema changes to PostgreSQL
```

There are no test scripts configured.

## Architecture

Each project follows an identical structure:

```
{project}/
├── client/src/          # React frontend
│   ├── App.tsx          # Router setup (Wouter) + providers
│   ├── pages/           # Route-level components
│   ├── components/      # Reusable components + shadcn/ui in components/ui/
│   ├── context/         # React Context (CartContext for cart state)
│   └── hooks/           # Custom hooks
├── server/
│   ├── index.ts         # Express entry point, middleware setup
│   ├── routes.ts        # API route registration (prefix all routes with /api)
│   └── storage.ts       # IStorage interface + MemStorage implementation
└── shared/
    └── schema.ts        # Drizzle ORM schema (source of truth for DB types)
```

### Key Design Decisions

- **Routing:** [Wouter](https://github.com/molefrog/wouter) (not React Router)
- **UI components:** shadcn/ui (New York style, Lucide icons) — add components via `npx shadcn@latest add <component>`
- **Styling:** Tailwind CSS v4 (no `tailwind.config.ts` — configured in CSS)
- **ORM:** Drizzle ORM with PostgreSQL; `shared/schema.ts` defines tables and exports Zod insert schemas
- **Storage:** `server/storage.ts` exports an `IStorage` interface + in-memory fallback (`MemStorage`); swap for a DB-backed implementation without changing routes
- **State:** React Context for cart; `Mini-Computer-Shop-2` additionally uses Zustand
- **Data fetching:** TanStack React Query v5
- **Animations:** Framer Motion (all variants) + GSAP (Asset-Manager) + Lenis smooth scroll (Mini-Computer-Shop-2)
- **Auth:** Passport.js (local strategy) with express-session; `memorystore` in dev, `connect-pg-simple` with PostgreSQL in prod

### Database

Drizzle config reads `DATABASE_URL` from environment. Schema lives in `shared/schema.ts`. Run `npm run db:push` to sync schema to the database (no migration files generated).

### Build Pipeline

`script/build.ts` runs esbuild for the server (CJS output) and Vite for the client. Output goes to `dist/` at the project root.

## Presentation Generator

The root-level `make-presentation.mjs` uses Playwright to screenshot all four running projects and generate presentation slides. Requires all four dev servers running on ports 5001–5004.
