# Design: `packages/db` as a direct data source (server loads at build time)

**Date:** 2026-06-04
**Status:** Revised to Approach B (direct use); pending spec review
**Branch:** `feat/db-data-source`

## Summary

Use `packages/db` (Drizzle + SQLite) **directly** in the client's data layer:
server `load` functions import `db` and run Drizzle queries. Because every route
is prerendered, those queries run **only at build time** (under Bun) and SvelteKit
bakes the results into the static output. The deployed Cloudflare Worker stays a
static-asset server — no `bun:sqlite`, `db`, or `drizzle` code reaches the
browser or the Worker runtime. The hand-maintained JSON tables are removed.

This was chosen over a build-time codegen step ("Approach A") so the data layer
imports and calls `db` directly, the way the package was intended to be used.

## Verified feasibility (spike)

A throwaway `+page.server.ts` querying the schema-stable `cube` table was built
end-to-end. Results:

- After fixing the package (below), `db.select().from(cube)` returns real rows.
- `bunx --bun vite build` runs SvelteKit's prerender under **Bun**, so
  `bun:sqlite` loads (plain `bun run`/`vite` use Node, which can't).
- `ssr: { external: ['db'] }` keeps `db` out of the bundle; it's resolved at
  runtime from `packages/db/dist`, where it opens the real `db.sqlite`.
- **adapter-cloudflare completes cleanly.** The prerendered `_spike.html`
  contains the queried data, and the emitted `_worker.js` (~4.3 KB) has **zero**
  references to `bun:sqlite` / `db` / `drizzle`.

So the approach is proven; the remaining work is the data-layer rework, the
one-time DB reseed, and the test/CI wiring.

## Context & problem

The client (`apps/client`, SvelteKit) is statically prerendered and deployed as
static assets to Cloudflare Workers. Findings that shape this design:

1. **`packages/db` was non-functional before this work.** Two bugs:
   - It called `drizzle(database, { relations })`. In `drizzle-orm@1.0.0-rc.3`
     the bun-sqlite factory only accepts a *string path* or a *config object*;
     a `Database` instance as the first arg is destructured for `client`/
     `connection`, finds neither, and falls back to `new Database(undefined)` —
     an **empty in-memory DB**. Every query returned `no such table`.
   - It loaded the SQLite file via Bun's `import … with { embed: "true",
     type: "sqlite" }`, which only materializes under `bun build --compile`. In a
     normal run `dist/db-*.sqlite` is a malformed file.
2. **The build is a Node runtime, not Bun.** `bun run vite build` honors vite's
   `#!/usr/bin/env node` shebang, so vite runs under Node, whose ESM loader
   rejects `bun:sqlite` (`ERR_UNSUPPORTED_ESM_URL_SCHEME … protocol 'bun:'`).
   Forcing Bun (`bunx --bun vite …`) fixes this.
3. **db can't run in the browser or Worker runtime** (`bun:sqlite`). All current
   loads are *universal* (`+page.ts`), which run in the browser on client-side
   navigation — so any `db`-touching code must be moved to **server** loads.
4. **The committed `db.sqlite` is stale.** Columns are camelCase
   (`previewAlgorithm`, `cubeId`, `setId`, …) from an older schema, but
   `schema.ts` uses `snakeCase.table` → Drizzle generates snake_case
   (`preview_algorithm`, …). SQLite's "unknown quoted identifier → string
   literal" misfeature masked this (queries returned literals like
   `"preview_algorithm"`). Data is also incomplete (3 subsets vs 7, 0 cases vs
   29, 0 algorithms vs 37). The JSON tables hold the real data and must be
   migrated into a freshly-schema'd DB.

## Goals

- The data layer imports `db` and queries it directly (no generated artifact).
- `db.sqlite` is the single committed source of truth; JSON tables removed.
- App stays fully static; nothing DB-related reaches the browser/Worker runtime.
- The repository's view-model logic and the page components are preserved.

## Non-goals / accepted trade-offs

- No Cloudflare D1, no request-time queries. Queries run only at prerender.
- **The build, dev server, and the data-layer tests must run under Bun**
  (`bunx --bun …`). Running them under plain Node breaks. Mitigated by baking
  `--bun` into the npm scripts.
- Binary `db.sqlite` in git is not diffable; data-change PRs show a blob.
- Editing data later: Drizzle Studio / SQL / migrations against
  `packages/db/db.sqlite`, then commit.

## Decisions (locked)

| Decision | Choice |
| --- | --- |
| Runtime model | Build-time, fully static (all routes prerendered). |
| db usage | Directly in server loads (`+page.server.ts` / `$lib/server/`). |
| Build runtime | Forced under Bun via `bunx --bun vite …`. |
| db resolution | `ssr.external: ['db']`; opened read-only from the package's dist. |
| Source of truth | Commit reseeded `db.sqlite`; delete JSON; edit via Studio/SQL. |

## Architecture / data flow

```
packages/db/db.sqlite            (committed source of truth)
   ▲  bun:sqlite (read-only), correct drizzle 1.0 client API
   │
import { db } from "db"          (resolved at runtime from packages/db/dist)
   │  used by $lib/server/repository.ts (server-only)
   ▼
+layout.server.ts / +page.server.ts load()s + entries()
   │  executed at PRERENDER time, under Bun (bunx --bun vite build)
   ▼
static HTML + __data.json   →   adapter-cloudflare   →   static assets + tiny Worker
   │
   ▼
browser: SPA navigation fetches the static __data.json (no db, ever)
```

## Phase 0 — Fix the package + reseed `db.sqlite`

**Fix `packages/db/index.ts`** (proven in the spike):

```ts
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { relations } from "./relations";

// dist/index.js → ../db.sqlite resolves to the committed packages/db/db.sqlite.
const client = new Database(new URL("../db.sqlite", import.meta.url).pathname, {
	readonly: true,
});

export const db = drizzle({ client, relations });

export * from "./schema";
```

Removes the compile-only embed import and uses the correct `{ client }` API.

**Reseed (one-time, while JSON still exists):**
1. Delete the stale `db.sqlite`; `bun run drizzle:push` in `packages/db` to create
   tables from `schema.ts` (→ snake_case columns). Optional: `drizzle-kit
   generate` an initial migration into `packages/db/drizzle/` for version control.
2. `packages/db/seed.ts` (one-time) opens the canonical `./db.sqlite` directly,
   reads `../../apps/client/src/lib/data/tables/*.json`, inserts in order
   cube→set→subset→case→algorithm. The `case.defaultAlgorithmId ↔
   algorithm.caseId` circular FK: insert cases with `defaultAlgorithmId = null`,
   back-fill after algorithms (or `PRAGMA foreign_keys = OFF`). JSON keys already
   match the Drizzle JS property names.
3. Verify counts (1 cube / 3 sets / 7 subsets / 29 cases / 37 algorithms) and
   spot-check `OLL-21` → default `OLL-21__0`.
4. Rebuild `db` (`bun run --filter db build`), commit `db.sqlite`, remove
   `seed.ts` and the JSON tables.

## Phase 1 — Build / runtime config

- `apps/client/vite.config.ts`: add `ssr: { external: ['db'] }`.
- `apps/client/package.json` scripts:
  - `"build": "bunx --bun vite build"`
  - `"dev": "bunx --bun vite dev"` (dev server runs server loads → needs Bun;
    verify during implementation)
  - `"preview": "vite preview"` (serves static output; unchanged)
- Add `"db": "workspace:*"` to `apps/client` **devDependencies**.

## Phase 2 — Data layer to server-only

- Move the repository to `apps/client/src/lib/server/repository.ts`. Replace the
  four `./tables/*.json` imports with four `db.select().from(...).all()` calls
  (bun-sqlite `.all()` is synchronous) feeding the **same** maps and view-model
  logic (`buildContext`, `getSidebarTree`, etc.) — the public functions are
  unchanged.
- `breadcrumbs.ts` is pure; keep it shared in `$lib/data/`.
- Convert every load to a server load, moving `entries()` with them:
  - `+layout.ts` → `+layout.server.ts`
  - `+page.ts` (home) → `+page.server.ts`
  - `[setId]/+page.ts` → `[setId]/+page.server.ts`
  - `[setId]/[subsetId]/+page.ts` → `+page.server.ts`
  - `[setId]/[subsetId]/[caseId]/+page.ts` → `+page.server.ts`
- Page components (`+page.svelte`) consume `data` exactly as today.
- `types.ts` stays the UI contract. Optional: derive base row types from `db`.

## Phase 3 — Tests, turbo, CI

- **Tests need Bun** (the repository now imports `bun:sqlite`). The vitest
  "server" project is `environment: 'node'`, which can't load `bun:sqlite`.
  Plan: change `"test": "bunx --bun vitest run --project server"` and verify
  vitest-under-Bun exposes `bun:sqlite`. If it doesn't, fall back to splitting
  the repository into a pure view-model core (tested with fixtures) + a thin
  db-loading shell. `repository.test.ts` keeps its assertions (now reading real
  data); `tables.test.ts` is deleted or repointed to a db-backed integrity check.
- **turbo**: `build`/`test`/`check` already `dependsOn: ["^build"]`, so `db` is
  built before the client (required — `db` is externalized and resolved from its
  dist). Add `"dependsOn": ["^build"]` to `dev`. No `generate` task.
- **CI**: no workflow edits needed. `deploy.yml` (`bun run build`) and `pr.yml`
  (`test`/`lint`/`build`) run the package scripts, which now force Bun. `pr.yml`'s
  `check` is the root `biome format` (unaffected).

## Risks & mitigations

- **Build/dev/test must run under Bun.** Forced via `bunx --bun` in scripts;
  documented. A stray plain-Node `vite build` would fail fast with the `bun:`
  scheme error.
- **All routes must stay prerendered.** A non-prerendered route would try to run
  `db` on workerd and fail. They are all `prerender = true` today; keep it so.
- **Vitest + Bun + `bun:sqlite`** is the least-certain piece; verified early in
  implementation, with the pure-core refactor as fallback.
- **`../db.sqlite` path** assumes the one-level dist layout; revisit if bunup's
  output structure changes.
- **drizzle 1.0-rc API**: pin the version; the `drizzle({ client })` form is
  required (a `Database` positional arg silently yields an empty DB).

## Rollback

Revert the package fix, the vite/script changes, and the server-load conversion;
restore the JSON tables and universal loads. The reseeded `db.sqlite` can remain.
