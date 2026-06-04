# Design: cube as a first-class level + join-driven data layer

**Date:** 2026-06-04
**Status:** Approved (pending spec review)
**Branch:** `feat/db-data-source` (continues the db-as-data-source PR)

## Summary

Two related changes to the `db`-backed data layer:

1. **Join-driven data layer** — the repository returns Drizzle relational-query
   results *directly*. No `.map`/flatten/reorder/guards. The view-model becomes
   the join shape, enabled by marking the `one` relations non-optional so nested
   relations infer as non-null.
2. **Cube as a first-class navigation level** — `cube → set → subset → case`.
   Root `/` becomes a cube picker; the catalog moves under `/[cubeId]/…`. Adding a
   cube row later makes a new size appear automatically. Structural readiness only
   (data still just `3x3`; no cube-size-specific logic).

## Context

- The client reads `db` via Zod-validated `prerender` remote functions; the
  repository (`$lib/server/repository.ts`) already uses Drizzle **relational
  queries v2** (`db.query.*` with `where`/`with`). But it still post-processes
  each case with `toCaseWithContext` — flattening `subset.set` into a top-level
  `set` and reordering `algorithms` default-first. That hand-assembly is what this
  change removes.
- `CaseWithContext` consumers (`CaseView`, `CasesList`) use `c.viewType`,
  `c.subset.{name,setId,id}`, and `c.algorithms` — **never the flat `c.set`**.
  `AlgorithmsList` uses `algorithms[0]` as the headline and `slice(1)` as
  alternatives (so ordering is currently load-bearing).
- `cube` is data-only: one row (`3x3`), columns `id`/`name` only (no
  `previewAlgorithm`/`viewType`); all 3 sets belong to it. Not referenced in
  client navigation today.
- Drizzle v2 confirmed: `one` relations accept `optional: false`
  (`OneConfig.optional`, default `true`), which makes the inferred nested object
  non-null; `.sync()` returns the fully-typed result.

## Goals

- Repository functions return relational-query results directly — no manual
  iteration/stitching of related rows in JS.
- `cube` is the top of the hierarchy in routing, breadcrumbs, and the sidebar.
- Adding a cube row surfaces a new size with no code changes.

## Non-goals / accepted trade-offs

- Existing URLs change (`/OLL/…` → `/3x3/OLL/…`); no redirects from old paths.
- No new cube data and no cube-size-specific visualization logic.
- The main-vs-alternatives algorithm split stays in `AlgorithmsList`
  (presentation): no join can filter a child list by the parent's own
  `defaultAlgorithmId`, so it is inherently a view concern.

## Decisions (locked)

| Decision | Choice |
| --- | --- |
| Data access | Relational queries returned directly; view-model = join shape. |
| Relation nullability | `one` relations marked `optional: false` (FKs are `notNull`). |
| Algorithm headline | Chosen in `AlgorithmsList` from `defaultAlgorithmId`, not repo order. |
| Cube level | First-class: `/[cubeId]/[setId]/[subsetId]/[caseId]`. |
| Root `/` | Clean cube picker (neutral cube chips, sized by total cases). |
| Sidebar | Cube as a `menu-title` section header above each cube's set→subset→case tree. |

---

## Part A — Join-driven data layer

### A1. `packages/db/relations.ts`
Add `optional: false` to the four `one` relations whose FK is `notNull`:
`set.cube`, `subset.set`, `case_.subset`, `algorithm.case`. (Leave the `many`
sides and any nullable FK alone.) Rebuild the package (`bun run --filter db build`).

### A2. `apps/client/src/lib/data/types.ts`
Redefine the case view-model as the join shape:

```ts
export interface CaseWithContext extends Case {
	subset: Subset & { set: Set };
	algorithms: Algorithm[];
}
```

(`Case` already has `id`, `name`, `setup`, `subsetId`, `defaultAlgorithmId`.)
Drop the previous flat `set` / `viewType` fields.

### A3. `$lib/server/repository.ts`
Every case query returns the relational result directly — no `toCaseWithContext`:

```ts
const caseWith = { subset: { with: { set: true } }, algorithms: true } as const;

export const getCase = (caseId: string): CaseWithContext | undefined =>
	db.query.case_.findFirst({ where: { id: caseId }, with: caseWith }).sync();

export const getSubsetCases = (subsetId: string): CaseWithContext[] =>
	db.query.case_.findMany({ where: { subsetId }, with: caseWith }).sync();
// getSetCases: where: { subset: { setId } }; getAllCases: no where; getCubeCases below.
```

With `optional: false` the `.sync()` return type matches `CaseWithContext`
exactly (non-null `subset`/`set`), so these need no casts. Non-case queries
(`getSets`, `findSet`, …) already return directly.

### A4. Components read the nested shape
- `CaseView`: `c.viewType` → `c.subset.set.viewType` (3 usages); pass
  `defaultAlgorithmId={c.defaultAlgorithmId}` to `AlgorithmsList`; the subset
  pill/link uses `c.subset.{name,id}` and the cube-prefixed href (Part B).
- `CasesList`: `c.viewType` → `c.subset.set.viewType`; cube-prefixed href.
- `AlgorithmsList`: add a `defaultAlgorithmId: string | null` prop;
  `main = algorithms.find((a) => a.id === defaultAlgorithmId) ?? algorithms[0]`;
  `others = algorithms.filter((a) => a.id !== main?.id)`. (Replaces the
  index-based `[0]`/`slice(1)` split.)

---

## Part B — Cube as a first-class level

### B1. Routes (move catalog under `[cubeId]`)
- `src/routes/+page.svelte` → **cube picker** (lists cubes). No `+page.ts`
  (prerender inherited from layout).
- New `src/routes/[cubeId]/+page.svelte` + `+page.server.ts` (`entries` = cubes)
  → the cube page (today's home content, scoped to the cube).
- Move `[setId]`, `[setId]/[subsetId]`, `[setId]/[subsetId]/[caseId]` under
  `[cubeId]/`; update each `+page.server.ts` `entries()` to enumerate the cube
  combinations (derive `cubeId` from `set.cubeId` etc. — available via joins).
- Page components read params with non-null assertions (e.g.
  `page.params.cubeId!`), matching the existing pattern.

### B2. Repository — cube functions (all single relational queries)
```ts
export const getCubes = (): Cube[] => db.query.cube.findMany().sync();
export const findCube = (id: string): Cube | undefined =>
	db.query.cube.findFirst({ where: { id } }).sync();
export const getCubeSets = (cubeId: string): Set[] =>
	db.query.set.findMany({ where: { cubeId } }).sync();
export const getCubeCases = (cubeId: string): CaseWithContext[] =>
	db.query.case_.findMany({ where: { subset: { set: { cubeId } } }, with: caseWith }).sync();

// Cube-rooted sidebar tree (cube → sets → subsets → cases{id,name})
export const getSidebarTree = (): SidebarCube[] =>
	db.query.cube
		.findMany({ with: { sets: { with: { subsets: { with: { cases: { columns: { id: true, name: true } } } } } } } })
		.sync();
```

### B3. `types.ts` — sidebar + preview
- `SidebarCube`: `Cube & { sets: SidebarSet[] }` (existing `SidebarSet` /
  `SidebarSubset` unchanged).
- `PreviewItem`: cube chips are neutral (cube has no `viewType`). Reuse the
  existing neutral-chip styling that the home "All" chip uses (the `all` flag /
  cube-gradient) — confirm the exact flag against `Preview.svelte` during
  implementation; add a `neutral?: boolean` only if `all` is unsuitable.

### B4. Remote functions (`catalog.remote.ts`)
- `getCubesView()` → `PreviewItem[]` of cube chips (`href: /[cubeId]`,
  `size` = cube's case count, neutral).
- `getCubeView(cubeId)` *(Zod `z.string()`)* → `{ items, cases }`: set chips
  (`/[cubeId]/[setId]`) + an "All" chip (`/[cubeId]`) + `getCubeCases(cubeId)`.
- `getSetView(setId)` / `getSubsetView(subsetId)` → derive `cubeId` from the
  resolved entity (`set.cubeId`) and build cube-prefixed hrefs. (Take the deepest
  id; resolve ancestors — hrefs always correct regardless of the URL's cubeId.)
- `getCaseView(caseId)` → `getCase(caseId)` (now the join shape); unchanged
  signature.

### B5. Breadcrumbs (`breadcrumbs.ts`)
Takes the cube-rooted tree (`SidebarCube[]`) + `params`
(`{ cubeId, setId, subsetId, caseId }`) and walks it to produce:
`Algorithms (/) › cube (/[cubeId]) › set (/[cubeId]/[setId]) › subset › case`.

### B6. Sidebar (`AppSidebar.svelte`)
Render `SidebarCube[]`: for each cube a `menu-title` linking to `/[cubeId]`,
followed by that cube's existing set→subset→case nested menu (hrefs gain the
`/[cubeId]` prefix). Search filters across the whole tree as today.

### B7. Layout (`+layout.svelte`)
`getBreadcrumbs(sidebar, page.params)` with the cube-rooted `sidebar`; otherwise
unchanged (still `await getSidebar()` outside any boundary so it SSRs).

---

## Testing

- `repository.test.ts`: update assertions to the join shape
  (`getCase('OLL-21')!.subset.set.id === 'OLL'`, `…subset.id === 'Oriented-Edges'`,
  default algorithm via `defaultAlgorithmId`), and add cube coverage
  (`getCubes()` → `['3x3']`; `getCubeSets('3x3')` → 3; `getCubeCases('3x3')` → 29).
- `breadcrumbs.test.ts`: rebuild the fixture as `SidebarCube[]` and assert the
  cube crumb (`Algorithms › 3x3 › OLL › Oriented Edges › Cross`).
- Full gate: `bun run check`, `bun run test`, `bun run lint`, `bun run build`;
  preview-verify SSR'd data, cube picker → cube → set → subset → case navigation,
  and client-side reactivity.

## Risks & mitigations

- **`optional: false` not yielding non-null types** — type signatures indicate it
  does; `bun run check` is the arbiter. Fallback: a minimal guard (as before).
- **URL change** breaks old deep links — accepted; redirects can be added later.
- **Two experimental features still in play** (remote functions + async) — the
  stable fallback (server `load`s over the same repository) is unchanged.
- **Cube chip styling** depends on `Preview.svelte`'s neutral path — verify the
  flag during implementation.
- **2-level relation filter** in `getCubeCases` (`where: { subset: { set: { cubeId } } }`)
  is assumed supported (single-level filters are verified); if not, fall back to
  `where: { subsetId: { in: <cube's subset ids> } }` or filter by the cube's sets.

## Rollback

Revert `relations.ts` (`optional` flags), the repository/types/component changes,
and the route move; restore the flat `CaseWithContext` + `toCaseWithContext`. The
DB and the rest of the data layer are unaffected.
