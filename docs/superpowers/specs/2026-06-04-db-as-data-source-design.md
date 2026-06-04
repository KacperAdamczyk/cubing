# Design: `packages/db` as the build-time data source

**Date:** 2026-06-04
**Status:** Approved (pending spec review)

## Summary

Make `packages/db` (Drizzle + SQLite) the authoritative source of algorithm data
for the client app, replacing the hand-maintained JSON tables in
`apps/client/src/lib/data/tables/`. The app stays **fully static / prerendered**;
`db` is read **at build time** by a Bun script that emits a browser-safe data
module, which the existing repository consumes unchanged.

## Context & problem

The client (`apps/client`, SvelteKit) is statically prerendered and deployed as
static assets to Cloudflare Workers. Today the data layer
([`repository.ts`](../../../apps/client/src/lib/data/repository.ts)) imports four
hand-written JSON files and assembles UI view-models (`CaseWithContext`, sidebar
tree). `packages/db` exists and mirrors the same schema (cube → set → subset →
case → algorithm) but is **not wired into the client**.

Two findings from exploration shape this design:

1. **`packages/db` is Bun-runtime-only.** It uses `drizzle-orm/bun-sqlite` and
   embeds the SQLite file via Bun's `import … with { embed: "true", type: "sqlite" }`.
   That driver needs `bun:sqlite`, so it **cannot run in the browser or on the
   Cloudflare Worker runtime**. Every route uses a *universal* `load` (`+page.ts`),
   which also runs in the browser on client-side navigation — so any data the
   repository serves must be present in the **client bundle**. Net: `db` can only
   run at **build time, under Bun**.

2. **The committed `db.sqlite` is stale.** Its columns are camelCase (`caseId`,
   `setId`, …) from an older schema, but the current
   [`schema.ts`](../../../packages/db/schema.ts) uses `snakeCase.table(...)`
   (→ `case_id`, …), so Drizzle queries against it would fail outright. It is also
   nearly empty: 3 subsets (JSON has 7), **0 cases** (JSON has 29), **0 algorithms**
   (JSON has 37). The JSON tables are the real, current data and must be migrated
   into a freshly-schema'd `db.sqlite`.

## Goals

- `db.sqlite` becomes the single, committed source of truth for algorithm data.
- The client reads that data (transitively) — JSON tables are removed.
- The app remains fully static; no `bun:sqlite` in the browser or Worker.
- The repository's view-model logic, the route loads, and the bundler are
  unchanged. Existing tests keep passing.

## Non-goals / accepted trade-offs

- **Not** going dynamic: no Cloudflare D1, no server `load`s, no request-time
  queries. Data is a build-time snapshot.
- **Not** keeping the JSON as a source. After the one-time migration they are
  deleted.
- Binary `db.sqlite` in git is not diffable; data-change PRs show a blob. Accepted.
- Editing data going forward is done via Drizzle Studio / raw SQL / new migrations
  against `packages/db/db.sqlite`, then committing the file.

## Decisions (locked)

| Decision | Choice |
| --- | --- |
| Runtime model | Build-time, stays fully static. |
| Source of truth | Commit `db.sqlite`; delete JSON; edit via Studio/SQL/migrations. |
| Generated artifact | Gitignored; regenerated from `db.sqlite` by a turbo `generate` task. |
| Generator reads `db` via | The package's public `db` export (`import { db } from "db"`). |

## Architecture / data flow

```
packages/db/db.sqlite            (committed source of truth)
   │  bunup build embeds a snapshot into dist  (turbo ^build)
   ▼
import { db } from "db"          (Bun, build-time only)
   │  generator: db.select() per table → typed arrays
   ▼
apps/client/src/lib/data/generated.ts   (plain arrays, gitignored, browser-safe)
   │
   ▼
repository.ts                    (unchanged: builds maps + view-models)
   │
   ▼
universal load()s → prerender → static assets on Cloudflare Workers
```

The only place `db`/`bun:sqlite` is touched is the build-time generator script,
run under Bun. Vite never imports `db`; the browser bundle only sees
`generated.ts` (plain data).

## Phase 0 — Reseed `db.sqlite` (one-time prerequisite)

Performed once during implementation, while the JSON still exists.

1. **Recreate the schema.** Delete the stale `packages/db/db.sqlite`. Run
   `bun run drizzle:push` in `packages/db` to create tables from `schema.ts`
   (→ correct `snake_case` columns). *(Optional but recommended: also
   `drizzle-kit generate` an initial migration into `packages/db/drizzle/` so the
   schema is version-controlled, not just pushed.)*
2. **Seed from JSON.** A one-time Bun script (`packages/db/seed.ts`) opens the
   **canonical** `./db.sqlite` directly — `drizzle(new Database("./db.sqlite"),
   { schema })` — and inserts rows read from
   `../../apps/client/src/lib/data/tables/*.json`.
   - It must write to the canonical file, **not** the embedded `db` export (which
     points at the dist snapshot).
   - Insert order: `cube → set → subset → case → algorithm`. The `case.defaultAlgorithmId ↔ algorithm.caseId`
     circular FK is handled by inserting cases with `defaultAlgorithmId = null`
     first and back-filling after algorithms are inserted (or running the inserts
     with `PRAGMA foreign_keys = OFF`).
   - JSON keys are camelCase and match the Drizzle JS property names, so values map
     directly; Drizzle handles the snake_case column mapping.
3. **Verify.** Assert row counts (1 cube / 3 sets / 7 subsets / 29 cases /
   37 algorithms) and spot-check `OLL-21` resolves with default algorithm
   `OLL-21__0`.
4. **Commit & clean up.** Commit the reseeded `db.sqlite` (and the migration if
   generated). Remove `packages/db/seed.ts` and the JSON tables (see Phase 2).

## Phase 1 — Build-time generator

New file `apps/client/scripts/generate-data.ts` (run under Bun):

```ts
// pseudocode
import { db, cube, set, subset, case_, algorithm } from "db";

const data = {
  cubes: await db.select().from(cube),
  sets: await db.select().from(set),
  subsets: await db.select().from(subset),
  cases: await db.select().from(case_),
  algorithms: await db.select().from(algorithm),
};

// write src/lib/data/generated.ts with a "do not edit" banner:
//   import type { Algorithm, Case, Cube, Set, Subset } from './types';
//   export const cubes: Cube[] = [...]; export const sets: Set[] = [...]; ...
```

- Drizzle returns objects keyed by JS property names (camelCase), which already
  match [`types.ts`](../../../apps/client/src/lib/data/types.ts) — no remapping.
- Output is a single TS module so it is typed and carries an auto-generated banner.
- It uses the package's public `db` export. turbo's `^build` rebuilds `db`'s
  embedded snapshot from the committed `db.sqlite` before the generate task runs,
  so the generated data is always fresh in turbo-driven workflows (CI + root
  scripts). **Caveat:** after editing data in Drizzle Studio, regenerate through
  turbo (or rebuild `db` first) — running the raw script alone would read the
  previous embedded snapshot.

*Alternative considered:* have the generator open the canonical `db.sqlite`
directly (like the seed) to avoid the embedded-snapshot indirection entirely. We
chose the public `db` export for simplicity and fidelity to "use the package";
the snapshot freshness is handled by the build graph.

## Phase 2 — Client wiring

- **`repository.ts`**: replace the four `./tables/*.json` imports with
  `import { sets, subsets, cases, algorithms } from './generated';`. All
  map-building and view-model code is unchanged.
- **`types.ts`**: kept as the UI contract (it also defines view-models like
  `CaseWithContext`, `PreviewItem`, `Breadcrumb` that are not in `db`).
  *(Optional: `import type` the five base row types from `db` to eliminate
  schema/type drift — type-only, erased at runtime, safe for the browser bundle.)*
- **Delete** `apps/client/src/lib/data/tables/` and the now-obsolete
  [`tables.test.ts`](../../../apps/client/src/lib/data/tables.test.ts) — or repoint
  its FK-integrity assertions at `generated.ts`.
- **Dependencies**: add `"db": "workspace:*"` to `apps/client/package.json`
  **devDependencies** (build-time only; never shipped).

## Phase 3 — Build orchestration

- **turbo.json**: add a `generate` task with `"dependsOn": ["^build"]` and
  `"outputs": ["src/lib/data/generated.ts"]`. Add `"generate"` to the `dependsOn`
  of `build`, `test`, `check`, `lint`, and `dev`.
- **`apps/client/package.json`**: add `"generate": "bun run scripts/generate-data.ts"`,
  and `pre*` hooks (`predev`, `prebuild`, `pretest`, `precheck`, `prelint`) that run
  `bun run generate` so direct `bun run …` in `apps/client/` also works. *(turbo is
  the primary mechanism; the pre-hooks cover standalone runs.)*
- **Ignore from lint/format**: add `src/lib/data/generated.ts` to
  `apps/client/.gitignore`, `.prettierignore`, and the ESLint `ignores`. It is
  still **type-checked** (tsc/svelte-check follow the import), which is desired.
- **CI**: no workflow edits needed. The turbo-driven steps —
  [`deploy.yml`](../../../.github/workflows/deploy.yml)'s `bun run build`, and
  [`pr.yml`](../../../.github/workflows/pr.yml)'s `test` / `lint` / `build`
  (`turbo …`) — now generate `generated.ts` first via the `generate` dependency.
  pr.yml's `check` step is the root `biome format` (not `turbo check`); it only
  formats syntax and does not require the artifact.

## Testing strategy

- [`repository.test.ts`](../../../apps/client/src/lib/data/repository.test.ts):
  passes unchanged — same data, same shapes (29 cases, OLL-21 → `OLL-21__0`, etc.).
  Requires `generated.ts` to exist at test time (handled by the turbo `generate`
  dependency + `pretest` hook).
- `tables.test.ts`: delete or repoint its row-count / FK-integrity checks at
  `generated.ts`.
- Optional: a small generator self-check (non-empty tables, FK integrity) emitted
  or asserted during generation, to fail the build on a corrupt `db.sqlite`.
- Full local gate before done: `bun run check`, `bun run test`, `bun run lint`,
  `bun run build` from the client, plus a `bun run preview` smoke check that pages
  render with the generated data.

## Risks & mitigations

- **Stale embedded snapshot** (generator reads dist, not canonical): mitigated by
  turbo `^build`; documented caveat for raw-script runs.
- **`generated.ts` missing on a clean checkout**: every consumer task depends on
  `generate` (turbo) and has a `pre*` hook; tsc/eslint/vitest all run after it.
- **Lint/format failing on generated output**: excluded via `.prettierignore` /
  ESLint `ignores`.
- **Circular FK during seed**: explicit insert ordering + back-fill (or FK pragma
  off).

## Rollback

The change is additive until the JSON is deleted. If needed, restore the JSON
tables and revert `repository.ts`'s import line; the generator, `db` dependency,
and turbo task can remain dormant.
