# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a monorepo using Bun workspaces. The application is in `apps/client/` (SvelteKit).

**From `apps/client/`:**
- `bun run dev` - Start the Vite dev server (http://localhost:5173)
- `bun run build` - Build to `.svelte-kit/cloudflare/` (adapter-cloudflare, fully prerendered)
- `bun run preview` - Preview the production build (`vite preview`)
- `bun run deploy` - Deploy to Cloudflare Workers (`wrangler deploy`, uses `apps/client/wrangler.jsonc`)
- `bun run test` - Run Vitest unit tests (node project)
- `bun run check` - Run `svelte-check` for type/syntax errors
- `bun run lint` - Run Prettier check + ESLint
- `bun run format` - Apply Prettier formatting

## Architecture Overview

A **Rubik's Cube algorithm learning application** built with:
- **SvelteKit 2** - file-based routing, statically prerendered (`adapter-cloudflare`, deployed to Cloudflare Workers)
- **Svelte 5** - runes-mode components
- **TypeScript** - type safety throughout
- **Tailwind CSS 4 + daisyUI 5** - styling
- **Vitest** - testing framework

### Core Structure

**`packages/cube/`** - framework-agnostic 3D cube simulation engine (reused as-is). See `packages/cube/src/internals.md`. Key API: `algorithmToFaces`, `applyRotations`, `createCube`, `isCubeSolved`, `rotationsFromString`, `toColoredFaceSlices`, `getAdjacentPieces`, `Colors`, `Faces`.

**`packages/db/`** - Drizzle + SQLite schema (cube → set → subset → case → algorithm). The intended long-term data source; not yet wired into the client.

**`apps/client/src/lib/data/`** - the data layer. `tables/*.json` are normalized, db-mirrored data. `repository.ts` reads them and assembles UI view-models (`CaseWithContext`, sidebar tree). `types.ts` mirrors `packages/db/schema.ts`. Swapping to the real `db` later is localized to the repository.

**`apps/client/src/lib/components/`** - UI components, incl. `cube/` (the 2D cube visualization: `CubeView`, `Face`, `Piece`, `PLL`, `OLL`, `F2L`, `LastLayer`).

**`apps/client/src/lib/layout/`** - `AppSidebar`.

**`apps/client/src/routes/`** - file-based routes: `/`, `/[setId]`, `/[setId]/[subsetId]`, `/[setId]/[subsetId]/[caseId]`; the root `+layout.svelte` is the daisyUI drawer shell. Each dynamic route exports `entries()` for prerendering.

**Data model:** `cube` is data-only (single `3x3`); navigation is `set → subset → case`. `viewType` (`F2L`/`OLL`/`PLL`) lives on `set` and is inherited. Each algorithm is its own row; a case's `defaultAlgorithmId` is the "main" algorithm.

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