## Purpose

This file gives concise, actionable context for AI coding agents working on the `my-portfolio` Next.js site so they can be immediately productive.

## Big picture (quick)
- Next.js (app router) TypeScript site located in `my-portfolio/`.
- Project uses `next` v16 with `output: 'export'` (static export) — build produces an `out` folder (`my-portfolio/out`).
- Styling via Tailwind + a small `app/globals.css` with project-specific utilities and animations.
- Small client-side chat widget (`components/ChatWidget.tsx`) posts to `/api/chat` which proxies to OpenAI — this API requires a server-side env var `OPENAI_API_KEY`.

## How to run (developer workflows)
- Local dev (inside `my-portfolio`):
  - npm run dev — starts Next dev server (API route available locally).
  - npm run build — builds static export into `my-portfolio/out` (used by GitHub Actions).
  - npm start — runs the Next production server (not typically used for static export).
- CI / deploy: See `.github/workflows/nextjs.yml` — workflow does `cd my-portfolio && npm install && npm run build` and uploads `my-portfolio/out` to GitHub Pages.

## Key files & patterns (refer to these)
- `my-portfolio/next.config.ts` — output: 'export', images unoptimized.
- `my-portfolio/app/` — app-router entry. `app/layout.tsx` (global fonts/styles) and `app/page.tsx` (home composition).
- `my-portfolio/components/` — UI components; stateful components add "use client" at top (e.g. `ChatWidget.tsx`).
- `my-portfolio/app/api/chat/route.ts` — server handler that proxies to OpenAI using `process.env.OPENAI_API_KEY`.
- `my-portfolio/lib/utils.ts` — utility helpers (e.g. `cn()` wrapper using `clsx` + `tailwind-merge`).
- `my-portfolio/globals.css` — custom Tailwind utilities and design tokens used across the site (e.g., `.display`, `.glass`, `.animate-floaty`).
- `my-portfolio/tsconfig.json` — path alias `@/*` maps to project root; imports use `@/components/...`.

## Project-specific conventions / gotchas
- Absolute import alias: use `@/...` per `tsconfig.json` (e.g., `import Navbar from "@/components/Navbar"`).
- Client vs Server components: default is server; components with local state must include `"use client"` (see `ChatWidget.tsx`).
- Chat API: `/api/chat` is a server-only proxy that requires `OPENAI_API_KEY`. Note: static export (GitHub Pages) will not host API routes — for a working production chat you must deploy to a platform that supports serverless functions or remove the proxy and call OpenAI from a server.
- Build output: CI expects a static `my-portfolio/out` directory (see `.github/workflows/nextjs.yml`). Changing `next.config` output or build steps must be reflected in CI.

## Examples (copyable patterns)
- Classname merge helper: `import { cn } from "@/lib/utils";` then `className={cn("p-4", condition && "text-red-500")}`
- API POST example (client): `fetch("/api/chat", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ message }) })`

## When editing / adding features
- Add presentational components to `components/`; add page-level composition in `app/page.tsx` or new route folders under `app/`.
- Prefer Tailwind utilities and the project's utility classes in `globals.css` for styling consistency.
- If your change needs server-side runtime (env secrets or server functions), update CI/deploy strategy — static export + GitHub Pages will not run server code.

## Quick checklist for PRs
- Confirm local `npm run dev` works and pages render.
- If touching the chat API, verify `OPENAI_API_KEY` is set locally (`.env.local`) and test POST flow.
- Keep `next.config.ts` export mode in mind — don't assume server runtime in production unless CI/deploy is changed.

---
If any of this is unclear or you want the agent to follow stricter rules (e.g., always open a PR template, run lint, or add tests), tell me what to add and I will iterate.
