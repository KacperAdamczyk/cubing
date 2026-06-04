# Cube level + join-driven data layer — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `cube` as the first navigation level (`cube → set → subset → case`) and make the repository return Drizzle relational-query results directly (no JS stitching/reordering).

**Architecture:** Mark the `one` relations `optional: false` so nested relations infer non-null; the repository returns `db.query.*` results directly and `CaseWithContext` becomes the join shape. Cube becomes a first-class route level (`/[cubeId]/…`) with a cube picker at `/`, fed by cube-scoped relational queries. The algorithm headline moves to `AlgorithmsList` (keyed on `defaultAlgorithmId`).

**Tech Stack:** SvelteKit 2.63 (remote functions + experimental async), Svelte 5.56, Drizzle 1.0.0-rc.3 relational queries v2 + `bun:sqlite`, Zod 3.25, Vite 8, Bun, adapter-cloudflare.

**Spec:** `docs/superpowers/specs/2026-06-04-cube-level-and-join-driven-data.md`.

**Branch:** `feat/db-data-source` (continues the open PR).

---

## File map

**Modify**
- `packages/db/relations.ts` — `optional: false` on the four `one` relations
- `apps/client/src/lib/data/types.ts` — `CaseWithContext` = join shape; add `SidebarCube`
- `apps/client/src/lib/server/repository.ts` — return-directly queries + cube functions + cube-rooted sidebar
- `apps/client/src/lib/server/repository.test.ts` — join-shape + cube assertions
- `apps/client/src/lib/data/breadcrumbs.ts` + `.test.ts` — cube-rooted tree + cube crumb
- `apps/client/src/lib/data/catalog.remote.ts` — `getCubesView`/`getCubeView` + cube-prefixed hrefs
- `apps/client/src/lib/components/AlgorithmsList.svelte` — headline from `defaultAlgorithmId`
- `apps/client/src/lib/components/CaseView.svelte`, `CasesList.svelte` — nested shape + cube hrefs
- `apps/client/src/lib/layout/AppSidebar.svelte` — cube-rooted (section header per cube)
- `apps/client/src/routes/+page.svelte` — cube picker

**Create**
- `apps/client/src/routes/[cubeId]/+page.svelte` + `+page.server.ts` (cube page)
- (via `git mv`) `apps/client/src/routes/[cubeId]/[setId]/…` from `[setId]/…`

**Unchanged (verify only):** `apps/client/src/routes/+layout.svelte` — it already does `getBreadcrumbs(sidebar, page.params)` + `<AppSidebar {sidebar} />`; the types now flow through as `SidebarCube[]`.

---

## Task 1: Relations — mark `one` relations non-optional

**Files:** Modify `packages/db/relations.ts`

- [ ] **Step 1: Add `optional: false` to each `one` relation**

Replace `packages/db/relations.ts` with:

```ts
import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	cube: {
		sets: r.many.set(),
	},
	set: {
		cube: r.one.cube({
			from: r.set.cubeId,
			to: r.cube.id,
			optional: false,
		}),
		subsets: r.many.subset(),
	},
	subset: {
		set: r.one.set({
			from: r.subset.setId,
			to: r.set.id,
			optional: false,
		}),
		cases: r.many.case_(),
	},
	case_: {
		subset: r.one.subset({
			from: r.case_.subsetId,
			to: r.subset.id,
			optional: false,
		}),
		algorithms: r.many.algorithm(),
	},
	algorithm: {
		case: r.one.case_({
			from: r.algorithm.caseId,
			to: r.case_.id,
			optional: false,
		}),
	},
}));
```

- [ ] **Step 2: Rebuild the package**

Run: `bun run --filter db build`
Expected: `✓ Build completed`, exit 0.

- [ ] **Step 3: Commit**

```bash
git add packages/db/relations.ts
git commit -m "feat(db): mark one-relations non-optional (FKs are notNull)"
```

---

## Task 2: Types — join-shaped view-model + SidebarCube

**Files:** Modify `apps/client/src/lib/data/types.ts`

- [ ] **Step 1: Replace `CaseWithContext` with the join shape**

In `apps/client/src/lib/data/types.ts`, replace the `CaseWithContext` interface with:

```ts
/** View-model = the relational-query result: a case with its joined subset (+ set) and algorithms. */
export interface CaseWithContext extends Case {
	subset: Subset & { set: Set };
	algorithms: Algorithm[];
}
```

- [ ] **Step 2: Add `SidebarCube`**

In the same file, directly after the `SidebarSet` interface, add:

```ts
export interface SidebarCube extends Cube {
	sets: SidebarSet[];
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/client/src/lib/data/types.ts
git commit -m "feat(client): join-shaped CaseWithContext + SidebarCube type"
```

---

## Task 3: Repository — return-directly queries + cube functions

**Files:** Modify `apps/client/src/lib/server/repository.ts`, `apps/client/src/lib/server/repository.test.ts`

- [ ] **Step 1: Rewrite the test to the new shape + cube coverage**

Replace `apps/client/src/lib/server/repository.test.ts` with:

```ts
import { describe, expect, it } from 'vitest';
import {
	getAllCases,
	getCase,
	getCubeCases,
	getCubeSets,
	getCubes,
	getSetCases,
	getSets,
	getSidebarTree,
	getSubsetCases
} from './repository';

describe('repository', () => {
	it('returns the single 3x3 cube with its sets and cases', () => {
		expect(getCubes().map((c) => c.id)).toEqual(['3x3']);
		expect(
			getCubeSets('3x3')
				.map((s) => s.id)
				.sort()
		).toEqual(['F2L', 'OLL', 'PLL']);
		expect(getCubeCases('3x3')).toHaveLength(29);
	});

	it('returns all sets', () => {
		expect(
			getSets()
				.map((s) => s.id)
				.sort()
		).toEqual(['F2L', 'OLL', 'PLL']);
	});

	it('returns a case with its joined subset/set and algorithms', () => {
		expect(getAllCases()).toHaveLength(29);

		const oll21 = getCase('OLL-21');
		expect(oll21).toBeDefined();
		expect(oll21!.subset.set.viewType).toBe('OLL');
		expect(oll21!.subset.set.id).toBe('OLL');
		expect(oll21!.subset.set.cubeId).toBe('3x3');
		expect(oll21!.subset.id).toBe('Oriented-Edges');
		expect(oll21!.defaultAlgorithmId).toBe('OLL-21__0');
		expect(oll21!.algorithms.some((a) => a.id === 'OLL-21__0')).toBe(true);
	});

	it('groups cases by set and subset consistently', () => {
		const setTotal = getSets().reduce((n, s) => n + getSetCases(s.id).length, 0);
		expect(setTotal).toBe(29);
		expect(getSubsetCases('Oriented-Edges').every((c) => c.subset.id === 'Oriented-Edges')).toBe(
			true
		);
	});

	it('builds a cube-rooted sidebar tree', () => {
		const tree = getSidebarTree();
		expect(tree.map((c) => c.id)).toEqual(['3x3']);
		const cube = tree[0];
		expect(cube.sets.map((s) => s.id).sort()).toEqual(['F2L', 'OLL', 'PLL']);
		const oll = cube.sets.find((s) => s.id === 'OLL')!;
		expect(oll.subsets.length).toBeGreaterThan(0);
		expect(oll.subsets[0].cases.length).toBeGreaterThan(0);
	});
});
```

- [ ] **Step 2: Run it — expect failure**

Run: `cd apps/client && bunx --bun vitest run --project server src/lib/server/repository.test.ts`
Expected: FAIL (old repo has no `getCubes`/`getCubeSets`/`getCubeCases`; old shape has `c.viewType`/`c.set`).

- [ ] **Step 3: Rewrite the repository**

Replace `apps/client/src/lib/server/repository.ts` with:

```ts
import { db } from 'db';
import type { CaseWithContext, Cube, Set, SidebarCube, Subset } from '$lib/data/types';

const caseWith = { subset: { with: { set: true } }, algorithms: true } as const;

export const getCubes = (): Cube[] => db.query.cube.findMany().sync();

export const findCube = (cubeId: string): Cube | undefined =>
	db.query.cube.findFirst({ where: { id: cubeId } }).sync();

export const getCubeSets = (cubeId: string): Set[] =>
	db.query.set.findMany({ where: { cubeId } }).sync();

export const getSets = (): Set[] => db.query.set.findMany().sync();

export const findSet = (setId: string): Set | undefined =>
	db.query.set.findFirst({ where: { id: setId } }).sync();

export const findSubset = (subsetId: string): Subset | undefined =>
	db.query.subset.findFirst({ where: { id: subsetId } }).sync();

export const getSetSubsets = (setId: string): Subset[] =>
	db.query.subset.findMany({ where: { setId } }).sync();

export const getCubeCases = (cubeId: string): CaseWithContext[] =>
	db.query.case_.findMany({ where: { subset: { set: { cubeId } } }, with: caseWith }).sync();

export const getSetCases = (setId: string): CaseWithContext[] =>
	db.query.case_.findMany({ where: { subset: { setId } }, with: caseWith }).sync();

export const getSubsetCases = (subsetId: string): CaseWithContext[] =>
	db.query.case_.findMany({ where: { subsetId }, with: caseWith }).sync();

export const getAllCases = (): CaseWithContext[] =>
	db.query.case_.findMany({ with: caseWith }).sync();

export const getCase = (caseId: string): CaseWithContext | undefined =>
	db.query.case_.findFirst({ where: { id: caseId }, with: caseWith }).sync();

export const getSidebarTree = (): SidebarCube[] =>
	db.query.cube
		.findMany({
			with: {
				sets: { with: { subsets: { with: { cases: { columns: { id: true, name: true } } } } } }
			}
		})
		.sync();
```

*(With `optional: false`, `.sync()` infers non-null nested relations, so these return values match `CaseWithContext` without casts; if `svelte-check` still complains, append `as CaseWithContext[]` / `as CaseWithContext | undefined`. If `getCubeCases`' 2-level filter `where: { subset: { set: { cubeId } } }` errors, fall back to `where: { subsetId: { in: getCubeSets(cubeId).flatMap((s) => getSetSubsets(s.id)).map((sub) => sub.id) } }`.)*

- [ ] **Step 4: Run it — expect pass**

Run: `cd apps/client && bunx --bun vitest run --project server src/lib/server/repository.test.ts`
Expected: PASS (all 5).

- [ ] **Step 5: Commit**

```bash
git add apps/client/src/lib/server/repository.ts apps/client/src/lib/server/repository.test.ts
git commit -m "feat(client): repository returns join results directly + cube queries"
```

---

## Task 4: Breadcrumbs — cube-rooted

**Files:** Modify `apps/client/src/lib/data/breadcrumbs.ts`, `apps/client/src/lib/data/breadcrumbs.test.ts`

- [ ] **Step 1: Rewrite the test**

Replace `apps/client/src/lib/data/breadcrumbs.test.ts` with:

```ts
import { describe, expect, it } from 'vitest';
import { getBreadcrumbs } from './breadcrumbs';
import type { SidebarCube } from './types';

const tree: SidebarCube[] = [
	{
		id: '3x3',
		name: '3x3',
		sets: [
			{
				id: 'OLL',
				name: 'OLL',
				previewAlgorithm: '',
				cubeId: '3x3',
				viewType: 'OLL',
				subsets: [
					{
						id: 'Oriented-Edges',
						name: 'Oriented Edges',
						previewAlgorithm: '',
						setId: 'OLL',
						cases: [{ id: 'OLL-21', name: 'Cross' }]
					}
				]
			}
		]
	}
];

describe('getBreadcrumbs', () => {
	it('always starts with the Algorithms root', () => {
		expect(getBreadcrumbs(tree, {})).toEqual([{ name: 'Algorithms', href: '/' }]);
	});

	it('builds nested crumbs for cube/set/subset/case', () => {
		expect(
			getBreadcrumbs(tree, {
				cubeId: '3x3',
				setId: 'OLL',
				subsetId: 'Oriented-Edges',
				caseId: 'OLL-21'
			})
		).toEqual([
			{ name: 'Algorithms', href: '/' },
			{ name: '3x3', href: '/3x3' },
			{ name: 'OLL', href: '/3x3/OLL' },
			{ name: 'Oriented Edges', href: '/3x3/OLL/Oriented-Edges' },
			{ name: 'Cross', href: '/3x3/OLL/Oriented-Edges/OLL-21' }
		]);
	});
});
```

- [ ] **Step 2: Run it — expect failure**

Run: `cd apps/client && bunx --bun vitest run --project server src/lib/data/breadcrumbs.test.ts`
Expected: FAIL (old `getBreadcrumbs` takes `SidebarSet[]` and has no cube crumb).

- [ ] **Step 3: Rewrite breadcrumbs.ts**

Replace `apps/client/src/lib/data/breadcrumbs.ts` with:

```ts
import type { Breadcrumb, SidebarCube } from './types';

export const getBreadcrumbs = (
	tree: SidebarCube[],
	params: Record<string, string>
): Breadcrumb[] => {
	const crumbs: Breadcrumb[] = [{ name: 'Algorithms', href: '/' }];

	const cube = params.cubeId ? tree.find((c) => c.id === params.cubeId) : undefined;
	if (!cube) return crumbs;
	crumbs.push({ name: cube.name, href: `/${cube.id}` });

	const set = params.setId ? cube.sets.find((s) => s.id === params.setId) : undefined;
	if (!set) return crumbs;
	crumbs.push({ name: set.name, href: `/${cube.id}/${set.id}` });

	const subset = params.subsetId ? set.subsets.find((s) => s.id === params.subsetId) : undefined;
	if (!subset) return crumbs;
	crumbs.push({ name: subset.name, href: `/${cube.id}/${set.id}/${subset.id}` });

	const c = params.caseId ? subset.cases.find((x) => x.id === params.caseId) : undefined;
	if (!c) return crumbs;
	crumbs.push({ name: c.name, href: `/${cube.id}/${set.id}/${subset.id}/${c.id}` });

	return crumbs;
};
```

- [ ] **Step 4: Run it — expect pass**

Run: `cd apps/client && bunx --bun vitest run --project server src/lib/data/breadcrumbs.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/client/src/lib/data/breadcrumbs.ts apps/client/src/lib/data/breadcrumbs.test.ts
git commit -m "feat(client): cube-rooted breadcrumbs"
```

---

## Task 5: AlgorithmsList — headline from `defaultAlgorithmId`

**Files:** Modify `apps/client/src/lib/components/AlgorithmsList.svelte`

- [ ] **Step 1: Replace the component**

Replace `apps/client/src/lib/components/AlgorithmsList.svelte` with:

```svelte
<script lang="ts">
	import type { Algorithm, ViewType } from '$lib/data/types';
	import AlgorithmView from './AlgorithmView.svelte';

	const otherAlgorithmsLimit = 2;

	interface Props {
		class?: string;
		setup: string;
		algorithms: Algorithm[];
		defaultAlgorithmId: string | null;
		slim: boolean;
		viewType: ViewType;
	}

	let {
		class: className = '',
		setup,
		algorithms,
		defaultAlgorithmId,
		slim,
		viewType
	}: Props = $props();

	const mainAlgorithm = $derived(
		algorithms.find((a) => a.id === defaultAlgorithmId) ?? algorithms[0]
	);
	const otherAlgorithms = $derived(algorithms.filter((a) => a.id !== mainAlgorithm?.id));
	const limitedOtherAlgorithms = $derived(
		otherAlgorithms.slice(0, slim ? otherAlgorithmsLimit : otherAlgorithms.length)
	);
	const hasMore = $derived(otherAlgorithms.length > limitedOtherAlgorithms.length);
</script>

<div class={[className, 'flex flex-col gap-2']}>
	<AlgorithmView {setup} algorithm={mainAlgorithm} {slim} {viewType} isMain />
	{#each limitedOtherAlgorithms as algorithm (algorithm.id)}
		<AlgorithmView {setup} {algorithm} {slim} {viewType} />
	{/each}
	{#if hasMore}
		<span
			class="self-center rounded-full border border-base-300 px-2.5 py-0.5 text-xs font-semibold text-base-content/60"
		>
			+{otherAlgorithms.length - limitedOtherAlgorithms.length} more
		</span>
	{/if}
</div>
```

- [ ] **Step 2: Commit**

```bash
git add apps/client/src/lib/components/AlgorithmsList.svelte
git commit -m "feat(client): AlgorithmsList headline keyed on defaultAlgorithmId"
```

---

## Task 6: Remote functions — cube views + cube-prefixed hrefs

**Files:** Modify `apps/client/src/lib/data/catalog.remote.ts`

- [ ] **Step 1: Replace the module**

Replace `apps/client/src/lib/data/catalog.remote.ts` with:

```ts
import { error } from '@sveltejs/kit';
import { prerender } from '$app/server';
import { z } from 'zod';
import * as repo from '$lib/server/repository';
import type { PreviewItem } from './types';

export const getSidebar = prerender(() => repo.getSidebarTree());

export const getCubesView = prerender((): PreviewItem[] =>
	repo.getCubes().map((cube) => ({
		href: `/${cube.id}`,
		name: cube.name,
		previewAlgorithm: '',
		size: repo.getCubeCases(cube.id).length,
		viewType: 'PLL',
		all: true
	}))
);

export const getCubeView = prerender(z.string(), (cubeId) => {
	const cube = repo.findCube(cubeId);
	if (!cube) error(404, 'Cube not found');
	const sets = repo.getCubeSets(cubeId);
	const cases = repo.getCubeCases(cubeId);
	const items: PreviewItem[] = [
		{
			href: `/${cubeId}`,
			name: 'All',
			previewAlgorithm: '',
			size: cases.length,
			viewType: 'PLL',
			all: true
		},
		...sets.map((set) => ({
			href: `/${cubeId}/${set.id}`,
			name: set.name,
			previewAlgorithm: '',
			size: repo.getSetCases(set.id).length,
			viewType: set.viewType
		}))
	];
	return { items, cases };
});

export const getSetView = prerender(z.string(), (setId) => {
	const set = repo.findSet(setId);
	if (!set) error(404, 'Set not found');
	const cubeId = set.cubeId;
	const subsets = repo.getSetSubsets(set.id);
	const cases = repo.getSetCases(set.id);
	const items: PreviewItem[] = [
		{
			href: `/${cubeId}/${set.id}`,
			name: 'All',
			previewAlgorithm: '',
			size: cases.length,
			viewType: set.viewType
		},
		...subsets.map((subset) => ({
			href: `/${cubeId}/${set.id}/${subset.id}`,
			name: subset.name,
			previewAlgorithm: subset.previewAlgorithm,
			size: repo.getSubsetCases(subset.id).length,
			viewType: set.viewType
		}))
	];
	return { items, cases };
});

export const getSubsetView = prerender(z.string(), (subsetId) => {
	const subset = repo.findSubset(subsetId);
	const set = subset && repo.findSet(subset.setId);
	if (!subset || !set) error(404, 'Not found');
	const cubeId = set.cubeId;
	const subsets = repo.getSetSubsets(set.id);
	const cases = repo.getSubsetCases(subset.id);
	const items: PreviewItem[] = [
		{
			href: `/${cubeId}/${set.id}`,
			name: 'All',
			previewAlgorithm: '',
			size: repo.getSetCases(set.id).length,
			viewType: set.viewType
		},
		...subsets.map((s) => ({
			href: `/${cubeId}/${set.id}/${s.id}`,
			name: s.name,
			previewAlgorithm: s.previewAlgorithm,
			size: repo.getSubsetCases(s.id).length,
			viewType: set.viewType
		}))
	];
	return { items, cases };
});

export const getCaseView = prerender(z.string(), (caseId) => {
	const c = repo.getCase(caseId);
	if (!c) error(404, 'Case not found');
	return c;
});
```

- [ ] **Step 2: Commit**

```bash
git add apps/client/src/lib/data/catalog.remote.ts
git commit -m "feat(client): cube remote views + cube-prefixed hrefs"
```

---

## Task 7: Routes — cube picker, cube page, move catalog under [cubeId]

**Files:** Move `[setId]/…` → `[cubeId]/[setId]/…`; create `[cubeId]/+page.*`; rewrite root `+page.svelte`; rewrite each page component + `+page.server.ts`.

- [ ] **Step 1: Move the existing dynamic routes under `[cubeId]`**

```bash
cd apps/client/src/routes
mkdir -p "[cubeId]"
git mv "[setId]" "[cubeId]/[setId]"
cd /Volumes/Data/Projects/own/cubing
```

- [ ] **Step 2: Root `/` becomes the cube picker**

Replace `apps/client/src/routes/+page.svelte` with:

```svelte
<script lang="ts">
	import PreviewList from '$lib/components/PreviewList.svelte';
	import { getCubesView } from '$lib/data/catalog.remote';

	const items = await getCubesView();
</script>

<PreviewList {items} />
```

- [ ] **Step 3: Cube page `/[cubeId]`**

Create `apps/client/src/routes/[cubeId]/+page.svelte`:

```svelte
<script lang="ts">
	import { page } from '$app/state';
	import CasesList from '$lib/components/CasesList.svelte';
	import PreviewList from '$lib/components/PreviewList.svelte';
	import { getCubeView } from '$lib/data/catalog.remote';

	const view = $derived(await getCubeView(page.params.cubeId!));
</script>

<PreviewList items={view.items} />
<div class="mt-2 flex flex-col gap-2">
	<CasesList cases={view.cases} slim />
</div>
```

Create `apps/client/src/routes/[cubeId]/+page.server.ts`:

```ts
import * as repo from '$lib/server/repository';

export const prerender = true;

export const entries = () => repo.getCubes().map((cube) => ({ cubeId: cube.id }));
```

- [ ] **Step 4: Set page `/[cubeId]/[setId]`**

Replace `apps/client/src/routes/[cubeId]/[setId]/+page.svelte`:

```svelte
<script lang="ts">
	import { page } from '$app/state';
	import CasesList from '$lib/components/CasesList.svelte';
	import PreviewList from '$lib/components/PreviewList.svelte';
	import { getSetView } from '$lib/data/catalog.remote';

	const view = $derived(await getSetView(page.params.setId!));
</script>

<PreviewList items={view.items} />
<div class="mt-2 flex flex-col gap-2">
	<CasesList cases={view.cases} slim />
</div>
```

Replace `apps/client/src/routes/[cubeId]/[setId]/+page.server.ts`:

```ts
import * as repo from '$lib/server/repository';

export const prerender = true;

export const entries = () => repo.getSets().map((set) => ({ cubeId: set.cubeId, setId: set.id }));
```

- [ ] **Step 5: Subset page `/[cubeId]/[setId]/[subsetId]`**

Replace `apps/client/src/routes/[cubeId]/[setId]/[subsetId]/+page.svelte`:

```svelte
<script lang="ts">
	import { page } from '$app/state';
	import CasesList from '$lib/components/CasesList.svelte';
	import PreviewList from '$lib/components/PreviewList.svelte';
	import { getSubsetView } from '$lib/data/catalog.remote';

	const view = $derived(await getSubsetView(page.params.subsetId!));
</script>

<PreviewList items={view.items} />
<div class="mt-2 flex flex-col gap-2">
	<CasesList cases={view.cases} slim />
</div>
```

Replace `apps/client/src/routes/[cubeId]/[setId]/[subsetId]/+page.server.ts`:

```ts
import * as repo from '$lib/server/repository';

export const prerender = true;

export const entries = () =>
	repo.getSets().flatMap((set) =>
		repo.getSetSubsets(set.id).map((subset) => ({
			cubeId: set.cubeId,
			setId: set.id,
			subsetId: subset.id
		}))
	);
```

- [ ] **Step 6: Case page `/[cubeId]/[setId]/[subsetId]/[caseId]`**

Replace `apps/client/src/routes/[cubeId]/[setId]/[subsetId]/[caseId]/+page.svelte`:

```svelte
<script lang="ts">
	import { page } from '$app/state';
	import CaseView from '$lib/components/CaseView.svelte';
	import { getCaseView } from '$lib/data/catalog.remote';

	const currentCase = $derived(await getCaseView(page.params.caseId!));
</script>

<CaseView case={currentCase} slim={false} />
```

Replace `apps/client/src/routes/[cubeId]/[setId]/[subsetId]/[caseId]/+page.server.ts`:

```ts
import * as repo from '$lib/server/repository';

export const prerender = true;

export const entries = () =>
	repo.getSets().flatMap((set) =>
		repo.getSetSubsets(set.id).flatMap((subset) =>
			repo.getSubsetCases(subset.id).map((c) => ({
				cubeId: set.cubeId,
				setId: set.id,
				subsetId: subset.id,
				caseId: c.id
			}))
		)
	);
```

- [ ] **Step 7: Commit**

```bash
git add apps/client/src/routes
git commit -m "feat(client): cube picker root + cube page + catalog under /[cubeId]"
```

---

## Task 8: Case components — nested shape + cube hrefs

**Files:** Modify `apps/client/src/lib/components/CaseView.svelte`, `CasesList.svelte`

- [ ] **Step 1: CaseView**

Replace `apps/client/src/lib/components/CaseView.svelte` with:

```svelte
<script lang="ts">
	import type { CaseWithContext } from '$lib/data/types';
	import AlgorithmsList from './AlgorithmsList.svelte';
	import CubeView from './cube/CubeView.svelte';

	interface Props {
		case: CaseWithContext;
		slim: boolean;
	}

	let { case: c, slim }: Props = $props();

	const viewType = $derived(c.subset.set.viewType);
</script>

<article
	id={c.id}
	data-type={viewType}
	class="@container relative w-full overflow-hidden rounded-box border border-base-300 bg-(--type-tint) shadow-sm transition-shadow group-hover:shadow-lg"
>
	<span class="absolute inset-y-0 left-0 w-1.5 bg-(--type-accent)"></span>
	<div class="flex items-center gap-4 p-4 pl-5 @lg:gap-6 @lg:p-6 @lg:pl-7">
		<div class="size-28 shrink-0 @lg:size-40">
			<CubeView algorithm={c.setup} type={viewType} />
		</div>
		<div class="flex min-w-0 flex-1 flex-col gap-3">
			<div class="flex flex-wrap items-center gap-2">
				<h2 class="text-2xl font-extrabold tracking-tight">{c.name}</h2>
				{#if slim}
					<span
						class="rounded-full bg-(--type-pill) px-2.5 py-0.5 text-xs font-bold text-(--type-pill-content)"
					>
						{c.subset.name}
					</span>
				{:else}
					<a
						href={`/${c.subset.set.cubeId}/${c.subset.setId}/${c.subset.id}#${c.id}`}
						class="rounded-full bg-(--type-pill) px-2.5 py-0.5 text-xs font-bold text-(--type-pill-content) transition-opacity hover:opacity-80"
					>
						{c.subset.name}
					</a>
				{/if}
			</div>

			<AlgorithmsList
				{viewType}
				setup={c.setup}
				algorithms={c.algorithms}
				defaultAlgorithmId={c.defaultAlgorithmId}
				{slim}
			/>

			<p class="flex flex-wrap items-baseline gap-x-2 text-xs text-base-content/55">
				<span class="font-bold tracking-wide text-base-content/45 uppercase">Setup</span>
				<span class="font-mono">{c.setup}</span>
			</p>
		</div>
	</div>
</article>
```

- [ ] **Step 2: CasesList**

Replace `apps/client/src/lib/components/CasesList.svelte` with:

```svelte
<script lang="ts">
	import type { CaseWithContext } from '$lib/data/types';
	import CaseView from './CaseView.svelte';

	interface Props {
		cases: CaseWithContext[];
		slim: boolean;
	}

	let { cases, slim }: Props = $props();
</script>

<div class="flex flex-col gap-4">
	{#each cases as c (c.id)}
		<a
			href={`/${c.subset.set.cubeId}/${c.subset.setId}/${c.subset.id}/${c.id}`}
			data-type={c.subset.set.viewType}
			class="group block w-full rounded-box transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--type-accent)"
		>
			<CaseView case={c} {slim} />
		</a>
	{/each}
	{#if cases.length === 0}
		<div
			class="rounded-box border border-dashed border-base-300 p-10 text-center text-base-content/50"
		>
			No cases found.
		</div>
	{/if}
</div>
```

- [ ] **Step 3: Commit**

```bash
git add apps/client/src/lib/components/CaseView.svelte apps/client/src/lib/components/CasesList.svelte
git commit -m "feat(client): case components read joined shape + cube hrefs"
```

---

## Task 9: Sidebar — cube section headers

**Files:** Modify `apps/client/src/lib/layout/AppSidebar.svelte`

- [ ] **Step 1: Replace the component**

Replace `apps/client/src/lib/layout/AppSidebar.svelte` with:

```svelte
<script lang="ts">
	import { Box, Search } from '@lucide/svelte';
	import { page } from '$app/state';
	import type { SidebarCube } from '$lib/data/types';

	interface Props {
		sidebar: SidebarCube[];
	}

	let { sidebar }: Props = $props();

	let query = $state('');

	const filtered = $derived.by(() => {
		const q = query.toLowerCase();
		return sidebar
			.map((cube) => ({
				...cube,
				sets: cube.sets
					.map((set) => ({
						...set,
						subsets: set.subsets
							.map((subset) =>
								subset.name.toLowerCase().includes(q)
									? subset
									: {
											...subset,
											cases: subset.cases.filter((c) => c.name.toLowerCase().includes(q))
										}
							)
							.filter((subset) => subset.cases.length > 0)
					}))
					.filter((set) => set.subsets.length > 0)
			}))
			.filter((cube) => cube.sets.length > 0);
	});

	const isActive = (href: string) => page.url.pathname === href;

	const activeBar = 'shadow-[inset_3px_0_0_0_var(--type-accent)]';
</script>

<aside class="flex min-h-full w-72 flex-col gap-3 border-r border-base-300 bg-base-100 p-4">
	<a href="/" class="flex items-center gap-2.5 px-2 py-1">
		<span
			class="cube-gradient flex size-8 items-center justify-center rounded-lg text-white shadow-sm"
		>
			<Box class="size-4" />
		</span>
		<span class="text-base font-bold tracking-tight">Algorithms</span>
	</a>

	<label class="input input-sm w-full rounded-field">
		<Search class="size-4 opacity-50" />
		<input
			type="search"
			aria-label="Search for algs"
			placeholder="Search for algs"
			bind:value={query}
		/>
	</label>

	<ul class="menu w-full grow flex-nowrap gap-0.5 overflow-y-auto px-0">
		{#each filtered as cube (cube.id)}
			<li class="menu-title px-0">
				<a href={`/${cube.id}`} class={['font-bold', isActive(`/${cube.id}`) && 'text-base-content']}>
					{cube.name}
				</a>
			</li>
			{#each cube.sets as set (set.id)}
				<li data-type={set.viewType}>
					<a
						href={`/${cube.id}/${set.id}`}
						class={[
							'gap-2.5 font-semibold transition-colors',
							isActive(`/${cube.id}/${set.id}`) && `bg-(--type-soft) ${activeBar}`
						]}
					>
						<span class="size-2.5 rounded-[3px] bg-(--type-accent)"></span>
						{set.name}
					</a>
					<ul class="border-base-300">
						{#each set.subsets as subset (subset.id)}
							<li>
								<a
									href={`/${cube.id}/${set.id}/${subset.id}`}
									class={[
										'transition-colors',
										isActive(`/${cube.id}/${set.id}/${subset.id}`) &&
											`bg-(--type-soft) font-medium ${activeBar}`
									]}
								>
									{subset.name}
								</a>
								<ul>
									{#each subset.cases as c (c.id)}
										<li>
											<a
												href={`/${cube.id}/${set.id}/${subset.id}/${c.id}`}
												class={[
													'transition-colors',
													isActive(`/${cube.id}/${set.id}/${subset.id}/${c.id}`) &&
														`bg-(--type-soft) font-medium ${activeBar}`
												]}
											>
												{c.name}
											</a>
										</li>
									{/each}
								</ul>
							</li>
						{/each}
					</ul>
				</li>
			{/each}
		{/each}
	</ul>
</aside>
```

- [ ] **Step 2: Commit**

```bash
git add apps/client/src/lib/layout/AppSidebar.svelte
git commit -m "feat(client): cube-rooted sidebar with section headers"
```

---

## Task 10: Full verification

**Files:** none (verification + final commit)

- [ ] **Step 1: Type check**

Run: `cd apps/client && bun run check`
Expected: 0 errors. *(Watch for: `optional: false` yielding non-null nested types so the repository needs no casts; `page.params.*` non-null assertions.)*

- [ ] **Step 2: Tests**

Run: `cd apps/client && bun run test`
Expected: repository (cube + join shape) and breadcrumbs (cube crumb) suites PASS.

- [ ] **Step 3: Lint**

Run: `cd apps/client && bun run format && bun run lint`
Expected: clean.

- [ ] **Step 4: Build (root turbo, mirrors CI)**

Run: `bun run build`
Then verify the new structure + SSR'd data:
```bash
cd apps/client
ls .svelte-kit/cloudflare/3x3.html .svelte-kit/cloudflare/3x3/OLL.html .svelte-kit/cloudflare/3x3/OLL/Oriented-Edges/OLL-21.html
grep -oc "<svg" .svelte-kit/cloudflare/3x3/OLL/Oriented-Edges/OLL-21.html
grep -c "bun:sqlite\|drizzle" .svelte-kit/cloudflare/_worker.js
grep -o "3x3" .svelte-kit/cloudflare/index.html | head -1
cd /Volumes/Data/Projects/own/cubing
```
Expected: all three HTML files exist; case page has CaseView SVGs (>0); worker DB refs `0`; root shows the `3x3` cube chip.

- [ ] **Step 5: Preview + manual nav check**

Run: `preview_start` (server name `client`), then in the browser preview:
- `/` shows a single `3x3` cube chip; click it → `/3x3` (set chips + cases).
- Navigate `3x3 → OLL → Oriented Edges → a case`; breadcrumbs read `Algorithms › 3x3 › OLL › …`.
- Client-side navigate between two cases (sidebar) → CaseView + breadcrumbs update; the headline algorithm matches the case's default.
- Sidebar shows a `3x3` section header above the set→subset→case tree.

*(If a param page doesn't update on client-side nav, switch that page from `$derived(await getX(page.params…!))` to the markup `{#await getX(page.params…!)}…{:then view}…{/await}` form, which is reactive by construction.)*

- [ ] **Step 6: Final commit (if fixes were needed)**

```bash
git add -A
git commit -m "test: verify cube-level navigation + join-driven data layer"
```

---

## Notes for the implementer

- **Bun for build/dev/test** is mandatory (`bunx --bun …` in the scripts) — `bun:sqlite` only loads under Bun.
- `+layout.svelte` needs **no change**: it already passes `sidebar`/`page.params` to `AppSidebar` and `getBreadcrumbs`, which now accept `SidebarCube[]`.
- Hrefs are built from **resolved entity data** (`c.subset.set.cubeId`, `set.cubeId`), so links are always correct regardless of the URL's `cubeId`.
- Old URLs (`/OLL/…`) now 404 — accepted; redirects can be added later if desired.
