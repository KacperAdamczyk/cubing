# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a monorepo using Bun workspaces. The application is in `apps/client/` (SvelteKit).

**From `apps/client/`:**
- `bun run dev` - Start the Vite dev server through [portless](https://github.com/vercel-labs/portless) at a stable named URL: `https://cubing.localhost` (`:1355` when the proxy runs unprivileged). Vite's own port comes from `PORTLESS_APP_PORT`/random; `.claude/launch.json` sets it from the harness-assigned `$PORT` (`autoPort`), so previews use `http://localhost:<port>` directly. A second `bun run dev` in the same worktree fails with a portless route conflict — reuse the running server instead (git worktrees get their own `<branch>.cubing.localhost` route automatically).
- `bun run build` - Build to `.svelte-kit/cloudflare/` (adapter-cloudflare, fully prerendered)
- `bun run preview` - Preview the production build (`bunx --bun vite preview`; Bun runtime so the dynamic trainer routes can evaluate `db`)
- `bun run deploy` - Deploy to Cloudflare Workers (`wrangler deploy`, uses `apps/client/wrangler.jsonc`)
- `bunx wrangler dev --port 8788 --local-upstream localhost:8788 --upstream-protocol http` - Run the built Worker locally (from `apps/client`, after a build). The `--local-upstream` flags are required: plain `wrangler dev` simulates the custom-domain route, making `event.url.origin` the production domain, so the prerendered remote functions would fetch their JSON from the live site instead of the local assets
- `bun run test` - Run Vitest unit tests (server project, under Bun)
- `bun run check` - Run `svelte-check` for type/syntax errors

**From the repo root** (Biome is the single formatter/linter for the whole monorepo, Svelte files included — config in `biome.json`):
- `bun run lint` - `biome check .` (formatting, import order and lint rules; this is what CI runs)
- `bun run format` - `biome check --write .` (apply formatting, import sorting and safe lint fixes)
- `bun run typecheck` / `test` / `build` - run the workspace tasks through turbo (`typecheck` = `svelte-check`)

> `dev`/`build`/`test` run under the **Bun runtime** (`bunx --bun …` in the scripts) because `packages/db` reads `bun:sqlite` during prerender; plain Node fails with `ERR_UNSUPPORTED_ESM_URL_SCHEME`. Editing data in `packages/db/db.sqlite` requires `bun run --filter db build` before a client build so the externalized `db` resolves the latest file.

## Architecture Overview

A **Rubik's Cube algorithm learning application** built with:
- **SvelteKit 2** - file-based routing, prerendered except the trainer (`adapter-cloudflare`, deployed to Cloudflare Workers)
- **Svelte 5** - runes-mode components
- **TypeScript** - type safety throughout
- **Tailwind CSS 4 + daisyUI 5** - styling
- **Vitest** - testing framework

### Core Structure

**`packages/cube/`** - framework-agnostic 3D cube simulation engine (reused as-is). See `packages/cube/src/internals.md`. Key API: `algorithmToFaces`, `applyMoves`, `createCube`, `isCubeSolved`, `movesFromString`, `toColoredFaceGrids`, `getAdjacentPieces`, `Color`, `Face`.

**`packages/db/`** - Drizzle + SQLite, the **source of truth** for algorithm data (cube → set → subset → case → algorithm). `index.ts` opens the committed `db.sqlite` read-only via `bun:sqlite` (Bun-only; runs at build/prerender time, never in the browser/Worker — the Worker bundle shims `bun:sqlite` via the `alias` in `wrangler.jsonc`, and the sqlite path falls back gracefully where `import.meta.url` is unusable, because the dynamic trainer routes *evaluate* the `db` module graph without ever querying it). Schema in `schema.ts`, migrations in `drizzle/`; edit data via Drizzle Studio / SQL and commit `db.sqlite`.

**`apps/client/src/lib/server/` + `src/lib/data/`** - the data layer. `server/repository.ts` (server-only) queries `db` with Drizzle **relational queries (v2)** (`db.query.*` + `with`) and returns the join-shaped results directly — no manual stitching (`CaseWithContext` is the join shape; the sidebar tree is cube-rooted). `data/catalog.remote.ts` exposes cube/set/subset/case views as Zod-validated **`prerender` remote functions**; components `await` those (Svelte experimental async, `$derived(await …)`), with route params asserted non-null. `data/types.ts` mirrors `packages/db/schema.ts`. Everything is queried at prerender (build) time and inlined into the static output — no DB code reaches the browser/Worker.

**`apps/client/src/lib/components/`** - UI components, incl. `cube/` (the 2D cube visualization: `CubeView`, `Face`, `Piece`, `PLL`, `OLL`, `F2L`, `LastLayer`).

**`apps/client/src/lib/layout/`** - `AppSidebar`.

**`apps/client/src/routes/`** - file-based routes: `/` (cube picker), `/[cubeId]`, `/[cubeId]/[setId]`, `/[cubeId]/[setId]/[subsetId]`, `/[cubeId]/[setId]/[subsetId]/[caseId]`, plus the trainer `/train` (selection tree) and `/train/session` (stepper), which opt out of prerendering (`train/+layout.ts`) and are SSR'd dynamically on the Worker so the `?cases=…` query renders server-side; the root `+layout.svelte` is the daisyUI drawer shell. Pages fetch data via remote functions (no universal `load`s); each dynamic route's `+page.server.ts` exports `entries()` for prerendering. Enabled via `kit.experimental.remoteFunctions` + `compilerOptions.experimental.async` in `svelte.config.js`, with `ssr.external: ['db']` in `vite.config.ts`.

**`apps/client/src/lib/training/`** - the algorithm trainer's state helpers. The selection and position live only in the URL (`/train?cases=Ua,Ub&…`, `/train/session?cases=…&step=2`, see `selection.ts`); the trainer routes are dynamic, so pages read `page.url.searchParams` directly (only build-time code must not touch `url.search` — the shared root layout guards with `building`) and write it with `goto(..., { replaceState: true })` (shallow `replaceState` would leave `page.url` stale). At runtime on the Worker the prerender remote functions never run their queries — SvelteKit fetches their build-time JSON from the deployment's own static assets. UI in `components/training/` (`SelectionTree` = daisyUI `menu` + `checkbox` + `<details>`, `TrainingCard` = preview/setup with the solution behind a reveal).

**Data model:** navigation is `cube → set → subset → case` (cube is the top level; root `/` is the cube picker — currently a single `3x3`, ready for more sizes). `viewType` (`F2L`/`OLL`/`PLL`) lives on `set` and is inherited. Each algorithm is its own row; a case's `defaultAlgorithmId` is the "main" algorithm.

## Testing

- Tests use Vitest and are co-located with source files (`.test.ts`)
- Run `bun run test` for the unit tests, or `bun run test:unit` for interactive watch mode
- Cube engine tests live in `packages/cube`; run them with `bun test` there

## Deployment

Deployed to **Cloudflare Workers** (static assets) at https://cubing.admck.com.
- Config: `apps/client/wrangler.jsonc` (worker name `cubing`; custom domain set via `routes`).
- CI: `.github/workflows/deploy.yml` runs on every push to `main` (GitHub `production` environment; requires secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`).
- Manual: `cd apps/client && bun run build && bun run deploy`.

## Code Patterns

- **Svelte 5 runes-mode components** (`$props`, `$state`, `$derived`); presentational components live in `src/lib/components`, the cube visualization in `src/lib/components/cube`
- **Barrel exports** from `index.ts` files for clean imports
- **Type-first development** with comprehensive TypeScript definitions
- **Functional programming** patterns in cube operations (immutable transformations)