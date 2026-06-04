# Design: `packages/db` as a direct data source via remote functions

**Date:** 2026-06-04
**Status:** Approach B2 (remote functions + async components); pending spec review
**Branch:** `feat/db-data-source`

## Summary

Use `packages/db` (Drizzle + SQLite) **directly** from components via SvelteKit
**remote functions**. `prerender` remote functions in `.remote.ts` files import
`db` and run Drizzle queries; components call them and `await` the results with
Svelte's **experimental async** (`<svelte:boundary>`). Because every route is
prerendered, the queries run **only at build time** (under Bun), and the results
are baked into static HTML + static remote payloads. The deployed Cloudflare
Worker stays a static-asset server — no `bun:sqlite` / `db` / `drizzle` reaches
the browser or Worker runtime. The hand-maintained JSON tables are removed.

## Verified feasibility (spikes)

Two throwaway spikes against the schema-stable `cube` table proved the full
chain end-to-end:

- **The package works once fixed** (see Phase 0): `db.select().from(cube)`
  returns real rows.
- **`bunx --bun vite build`** runs SvelteKit's prerender under **Bun**, so
  `bun:sqlite` loads (plain `bun run`/`vite` use Node, which can't).
- **`ssr: { external: ['db'] }`** keeps `db` out of the bundle; it is resolved at
  runtime from `packages/db/dist`, where it opens the real `db.sqlite`.
- A **`prerender` remote function** importing `db` runs at build; its result is
  written to a static asset (`_app/remote/<hash>/getCubes`, containing the real
  `3x3` row).
- With **`experimental.async`** + `<svelte:boundary>` + top-level
  `await getCubes()`, the data is **SSR'd into the prerendered HTML**.
- **adapter-cloudflare completes cleanly**; the emitted `_worker.js` (~4.3 KB)
  has **zero** `bun:sqlite` / `db` / `drizzle` references.

The remaining work is the data-layer rework, the one-time DB reseed, and the
test/CI wiring.

## Context & problem

The client (`apps/client`, SvelteKit) is statically prerendered and deployed as
static assets to Cloudflare Workers. Findings that shape this design:

1. **`packages/db` was non-functional before this work.** Two bugs:
   - It called `drizzle(database, { relations })`. In `drizzle-orm@1.0.0-rc.3`
     the bun-sqlite factory only accepts a string path or a config object; a
     `Database` instance as the first positional arg is destructured for
     `client`/`connection`, finds neither, and falls back to
     `new Database(undefined)` — an **empty in-memory DB** (every query →
     `no such table`).
   - It loaded the SQLite via Bun's `import … with { embed: "true",
     type: "sqlite" }`, which only materializes under `bun build --compile`; in a
     normal run `dist/db-*.sqlite` is malformed.
2. **The build is a Node runtime, not Bun.** `bun run vite build` honors vite's
   `#!/usr/bin/env node` shebang → Node, whose ESM loader rejects `bun:sqlite`
   (`ERR_UNSUPPORTED_ESM_URL_SCHEME … protocol 'bun:'`). `bunx --bun vite …`
   fixes this.
3. **db can't run in the browser or Worker runtime** (`bun:sqlite`). All db
   access must therefore be in **server-only** code (`.remote.ts`,
   `$lib/server/`), executed only at build/prerender time.
4. **The committed `db.sqlite` is stale.** Columns are camelCase
   (`previewAlgorithm`, `cubeId`, `setId`, …) but `schema.ts` uses
   `snakeCase.table` → Drizzle generates snake_case. SQLite's "unknown quoted
   identifier → string literal" misfeature masked the mismatch (queries returned
   literals like `"preview_algorithm"`). Data is also incomplete (3 subsets vs 7,
   0 cases vs 29, 0 algorithms vs 37). The JSON tables hold the real data.

## Goals

- Components call `db`-backed remote functions directly; data is awaited inline.
- `db.sqlite` is the single committed source of truth; JSON tables removed.
- App stays fully static; nothing DB-related reaches the browser/Worker runtime.
- The repository's view-model logic is preserved (reused by the remote functions).

## Non-goals / accepted trade-offs

- No Cloudflare D1, no request-time queries. Queries run only at prerender.
- **Two experimental features** are adopted: `kit.experimental.remoteFunctions`
  and Svelte `compilerOptions.experimental.async`. Their APIs may change across
  upgrades; pin `@sveltejs/kit` and `svelte` and re-verify on bumps.
- **The build, dev server, and data-layer tests must run under Bun**
  (`bunx --bun …`, baked into the npm scripts). Plain Node breaks.
- Binary `db.sqlite` in git is not diffable; data-change PRs show a blob.
- Client-side navigation fetches the (static) prerendered remote payload; a brief
  `<svelte:boundary>` pending state may show before it resolves.

## Decisions (locked)

| Decision | Choice |
| --- | --- |
| Runtime model | Build-time, fully static (all routes prerendered). |
| db usage | Directly in `prerender` remote functions (`.remote.ts`), via `$lib/server` repository. |
| Component data | `await` remote functions inside `<svelte:boundary>` (experimental async). |
| Build runtime | Forced under Bun via `bunx --bun vite …`. |
| db resolution | `ssr.external: ['db']`; opened read-only from the package's dist. |
| Route enumeration | Explicit `entries()` in `+page.server.ts` per dynamic route. |
| Source of truth | Commit reseeded `db.sqlite`; delete JSON; edit via Studio/SQL. |

## Architecture / data flow

```
packages/db/db.sqlite                         (committed source of truth)
   ▲ bun:sqlite (read-only) + correct drizzle 1.0 client API
   │
$lib/server/repository.ts                      (server-only; view-model logic)
   ▲ imported by
   │
$lib/data/*.remote.ts  →  prerender(() => repository.getX())
   ▲ called + awaited by
   │
+page.svelte / AppSidebar   (await fn() inside <svelte:boundary>)   [experimental async]
+page.server.ts             (export entries() — enumerates dynamic routes via repository)
   │  all executed at PRERENDER time, under Bun (bunx --bun vite build)
   ▼
static HTML (data SSR'd) + static remote payloads → adapter-cloudflare → assets + tiny Worker
   │
   ▼
browser: SPA navigation fetches the static remote payload (no db, ever)
```

## Phase 0 — Fix the package + reseed `db.sqlite`

**Fix `packages/db/index.ts`** (proven in the spikes):

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

**Reseed (one-time, while JSON still exists):**
1. Delete the stale `db.sqlite`; `bun run drizzle:push` in `packages/db` to create
   tables from `schema.ts` (→ snake_case columns). Optional: `drizzle-kit
   generate` an initial migration into `packages/db/drizzle/`.
2. `packages/db/seed.ts` (one-time) opens the canonical `./db.sqlite` directly,
   reads `../../apps/client/src/lib/data/tables/*.json`, inserts in order
   cube→set→subset→case→algorithm (circular `case ↔ algorithm` FK: insert cases
   with `defaultAlgorithmId = null`, back-fill after algorithms, or `PRAGMA
   foreign_keys = OFF`). JSON keys already match the Drizzle JS property names.
3. Verify counts (1 cube / 3 sets / 7 subsets / 29 cases / 37 algorithms) and
   spot-check `OLL-21` → default `OLL-21__0`.
4. Rebuild `db` (`bun run --filter db build`), commit `db.sqlite`, remove
   `seed.ts` and the JSON tables.

## Phase 1 — Config

- `apps/client/svelte.config.js`:
  - `kit.experimental.remoteFunctions = true`
  - `compilerOptions.experimental.async = true`
- `apps/client/vite.config.ts`: add `ssr: { external: ['db'] }`.
- `apps/client/package.json` scripts:
  - `"build": "bunx --bun vite build"`
  - `"dev": "bunx --bun vite dev"` (dev runs remote functions → needs Bun; verify
    during implementation)
  - `"preview": "vite preview"` (serves static output; unchanged)
- Add `"db": "workspace:*"` to `apps/client` **devDependencies**.

## Phase 2 — Data layer (server repository + remote functions + async components)

- **`$lib/server/repository.ts`**: the current repository, moved server-side, with
  the four `./tables/*.json` imports replaced by four `db.select().from(...).all()`
  calls (bun-sqlite `.all()` is synchronous) feeding the **same** maps and
  view-model logic. Public functions (`getSidebarTree`, `getCase`, `getSetCases`,
  …) unchanged. `breadcrumbs.ts` stays shared in `$lib/data/` (pure).
- **Remote functions** (e.g. `$lib/data/catalog.remote.ts`): thin `prerender`
  wrappers, e.g.

  ```ts
  import { prerender } from '$app/server';
  import * as repo from '$lib/server/repository';

  export const getSidebar = prerender(() => repo.getSidebarTree());
  export const getHome = prerender(() => /* sets + allCases + counts */);
  export const getSetView = prerender('unchecked', (setId: string) => /* … */);
  export const getSubsetView = prerender('unchecked', (p: { setId: string; subsetId: string }) => /* … */);
  export const getCaseView = prerender('unchecked', (caseId: string) => repo.getCase(caseId));
  ```

  Arg'd `prerender` calls are captured when their page is prerendered (driven by
  the route `entries()` below); add `inputs` only if a payload isn't otherwise
  reached.
- **Routes**:
  - `+layout.ts` keeps `export const prerender = true` (flag only; no db import).
  - Dynamic routes (`[setId]`, `[setId]/[subsetId]`, `[setId]/[subsetId]/[caseId]`)
    get a `+page.server.ts` exporting `entries()` (enumerating via the repository).
    No `load`.
  - `+page.svelte` / `AppSidebar` call the remote functions and `await` them
    inside `<svelte:boundary>` (with a `pending` snippet; route params come from
    `page` in `$app/state`).
- `types.ts` stays the UI contract.

## Phase 3 — Tests, turbo, CI

- **Tests need Bun** (`$lib/server/repository.ts` imports `bun:sqlite`). The vitest
  "server" project is `environment: 'node'`, which can't load `bun:sqlite`. Plan:
  `"test": "bunx --bun vitest run --project server"` and verify vitest-under-Bun
  exposes `bun:sqlite`. Fallback: split the repository into a pure view-model core
  (fixture-tested) + a thin db-loading shell. Move `repository.test.ts` alongside
  the server repository; delete or repoint `tables.test.ts`.
- **turbo**: `build`/`test`/`check` already `dependsOn: ["^build"]` (so `db` is
  built first — required, since `db` is externalized and resolved from its dist).
  Add `"dependsOn": ["^build"]` to `dev`.
- **CI**: no workflow edits. `deploy.yml` (`bun run build`) and `pr.yml`
  (`test`/`lint`/`build`) run the package scripts, which force Bun. `pr.yml`'s
  `check` is the root `biome format` (unaffected).

## Risks & mitigations

- **Two experimental features.** Pin `@sveltejs/kit` / `svelte`; re-verify the
  build + a prerendered page after any bump. The stable fallback is server `load`s
  (same repository, no remote functions / async) if the experimental APIs regress.
- **Build/dev/test must run under Bun.** Forced via `bunx --bun`; a stray Node
  build fails fast with the `bun:` scheme error.
- **All routes must stay prerendered.** A non-prerendered route would run `db` on
  workerd and fail. Keep `prerender = true`; `entries()` enumerates every dynamic
  route so all remote payloads are captured at build.
- **Vitest + Bun + `bun:sqlite`** is the least-certain piece; verify early, with
  the pure-core refactor as fallback.
- **`../db.sqlite` path** assumes the one-level dist layout; revisit if bunup's
  output changes.
- **drizzle 1.0-rc API**: the `drizzle({ client })` form is required (a `Database`
  positional arg silently yields an empty DB).

## Rollback

Revert the package fix, config, and data-layer changes; restore the JSON tables
and the universal loads. The reseeded `db.sqlite` can remain.
