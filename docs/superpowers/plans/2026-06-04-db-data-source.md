# db-as-data-source (remote functions + async components) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `packages/db` the committed source of truth for algorithm data, consumed directly from components via SvelteKit `prerender` remote functions + Svelte experimental async, with the app staying fully static.

**Architecture:** A fixed `db` package opens the real `db.sqlite` read-only. A server-only repository (`$lib/server/repository.ts`) builds view-models from `db`. Thin `prerender` remote functions in `$lib/data/catalog.remote.ts` (Zod-validated args) wrap the repository. Components `await` them inside `<svelte:boundary>`. Dynamic routes keep an `entries()` in `+page.server.ts`. The build/dev/tests run under Bun (`bunx --bun`), `db` is externalized, all routes prerender → static Cloudflare output with no DB in the Worker.

**Tech Stack:** SvelteKit 2.63, Svelte 5.56 (experimental async), Drizzle 1.0.0-rc.3 + `bun:sqlite`, Zod 3.25, Vite 8, Bun, adapter-cloudflare.

**Spec:** `docs/superpowers/specs/2026-06-04-db-as-data-source-design.md`. Every mechanism here was proven by spike during design.

---

## File map

**Modify**
- `packages/db/index.ts` — open the real file via correct drizzle 1.0 API
- `packages/db/package.json` — add `drizzle:generate` / `drizzle:migrate` scripts
- `packages/db/db.sqlite` — reseeded (binary, committed)
- `apps/client/package.json` — `db`+`zod` deps; `bunx --bun` build/dev/test scripts
- `apps/client/vite.config.ts` — `ssr.external: ['db']`
- `apps/client/svelte.config.js` — `experimental.remoteFunctions` + `compilerOptions.experimental.async`
- `apps/client/src/lib/data/breadcrumbs.ts` + `.test.ts` — derive from sidebar tree + params
- `apps/client/src/routes/+layout.svelte` + `+layout.ts` — sidebar/breadcrumbs via remote
- `apps/client/src/routes/+page.svelte` — home via remote
- `apps/client/src/routes/[setId]/+page.svelte`, `[setId]/[subsetId]/+page.svelte`, `[setId]/[subsetId]/[caseId]/+page.svelte` — data via remote
- `turbo.json` — `dev` dependsOn `^build`

**Create**
- `packages/db/seed.ts` (one-time; deleted in Task 9)
- `packages/db/drizzle/` (generated migration; committed)
- `apps/client/src/lib/server/repository.ts` + `repository.test.ts`
- `apps/client/src/lib/data/catalog.remote.ts`
- `apps/client/src/routes/[setId]/+page.server.ts`, `[setId]/[subsetId]/+page.server.ts`, `[setId]/[subsetId]/[caseId]/+page.server.ts`

**Delete**
- `apps/client/src/lib/data/repository.ts` + `repository.test.ts` (moved to `$lib/server/`)
- `apps/client/src/lib/data/tables.test.ts`
- `apps/client/src/lib/data/tables/` (after reseed)
- `apps/client/src/routes/+page.ts`, `[setId]/+page.ts`, `[setId]/[subsetId]/+page.ts`, `[setId]/[subsetId]/[caseId]/+page.ts`

---

## Task 1: Fix the `db` package

**Files:**
- Modify: `packages/db/index.ts`

- [ ] **Step 1: Replace the broken embed + drizzle call**

Replace the entire contents of `packages/db/index.ts` with:

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

- [ ] **Step 2: Rebuild the package**

Run: `bun run --filter db build`
Expected: `✓ Build completed`, exit 0.

- [ ] **Step 3: Commit**

```bash
git add packages/db/index.ts
git commit -m "fix(db): open real sqlite via correct drizzle 1.0 client API"
```

*(The data is still stale here; the query verification happens in Task 2 after the reseed.)*

---

## Task 2: Reseed `db.sqlite` (schema + data)

The committed DB has camelCase columns and is nearly empty. Recreate the schema as snake_case (via a committed migration) and seed from the current JSON.

**Files:**
- Modify: `packages/db/package.json`
- Create: `packages/db/seed.ts`, `packages/db/drizzle/` (generated)
- Modify: `packages/db/db.sqlite` (binary)

- [ ] **Step 1: Add drizzle generate/migrate scripts**

In `packages/db/package.json`, add to `"scripts"` (next to the existing `drizzle:*`):

```json
		"drizzle:generate": "drizzle-kit generate",
		"drizzle:migrate": "drizzle-kit migrate",
```

- [ ] **Step 2: Recreate the schema on a fresh DB**

```bash
rm -f packages/db/db.sqlite
cd packages/db && bun run drizzle:generate && bun run drizzle:migrate
```
Expected: a migration file under `packages/db/drizzle/`, and a new `db.sqlite` with snake_case columns. Verify:
Run: `sqlite3 packages/db/db.sqlite "select name from pragma_table_info('set');"`
Expected: `id name preview_algorithm cube_id view_type`

*(If `drizzle:migrate` errors on the sqlite driver, fall back to `bun run drizzle:push` on the freshly-deleted DB.)*

- [ ] **Step 3: Write the one-time seed script**

Create `packages/db/seed.ts`:

```ts
import { Database } from "bun:sqlite";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";
import cubeRows from "../../apps/client/src/lib/data/tables/cube.json";
import setRows from "../../apps/client/src/lib/data/tables/set.json";
import subsetRows from "../../apps/client/src/lib/data/tables/subset.json";
import caseRows from "../../apps/client/src/lib/data/tables/case.json";
import algorithmRows from "../../apps/client/src/lib/data/tables/algorithm.json";

const client = new Database("./db.sqlite");
const db = drizzle({ client });

client.run("PRAGMA foreign_keys = OFF");
db.delete(schema.algorithm).run();
db.delete(schema.case_).run();
db.delete(schema.subset).run();
db.delete(schema.set).run();
db.delete(schema.cube).run();

db.insert(schema.cube).values(cubeRows).run();
db.insert(schema.set).values(setRows).run();
db.insert(schema.subset).values(subsetRows).run();
// Insert cases without the algorithm FK first, then back-fill.
db.insert(schema.case_)
	.values(caseRows.map((c) => ({ ...c, defaultAlgorithmId: null })))
	.run();
db.insert(schema.algorithm).values(algorithmRows).run();
for (const c of caseRows) {
	if (c.defaultAlgorithmId) {
		db.update(schema.case_)
			.set({ defaultAlgorithmId: c.defaultAlgorithmId })
			.where(eq(schema.case_.id, c.id))
			.run();
	}
}

console.log("seeded", {
	cube: db.select().from(schema.cube).all().length,
	set: db.select().from(schema.set).all().length,
	subset: db.select().from(schema.subset).all().length,
	case: db.select().from(schema.case_).all().length,
	algorithm: db.select().from(schema.algorithm).all().length,
});
```

- [ ] **Step 4: Run the seed**

Run: `cd packages/db && bun seed.ts`
Expected: `seeded { cube: 1, set: 3, subset: 7, case: 29, algorithm: 37 }`

- [ ] **Step 5: Rebuild the package and verify a real query via the public export**

```bash
bun run --filter db build
cat > packages/db/_verify.ts <<'EOF'
import { db, case_ } from "db";
const rows = db.select().from(case_).all();
const oll21 = rows.find((c) => c.id === "OLL-21");
console.log("cases:", rows.length, "OLL-21 default:", oll21?.defaultAlgorithmId);
EOF
bun packages/db/_verify.ts
rm -f packages/db/_verify.ts
```
Expected: `cases: 29 OLL-21 default: OLL-21__0`

- [ ] **Step 6: Commit the reseeded DB + migration**

```bash
git add packages/db/package.json packages/db/db.sqlite packages/db/drizzle packages/db/seed.ts
git commit -m "feat(db): recreate snake_case schema + seed from JSON"
```

*(`seed.ts` is committed for now and removed in Task 9 with the JSON.)*

---

## Task 3: Client config (deps, Bun-forced scripts, externalize, experimental flags)

**Files:**
- Modify: `apps/client/package.json`, `apps/client/vite.config.ts`, `apps/client/svelte.config.js`, `turbo.json`

- [ ] **Step 1: Add deps**

In `apps/client/package.json` `"devDependencies"`, add (alphabetically, after `"daisyui"`):

```json
		"db": "workspace:*",
		"zod": "^3.25.76",
```

- [ ] **Step 2: Force Bun for build/dev/test**

In `apps/client/package.json` `"scripts"`, change these three:

```json
		"dev": "bunx --bun vite dev",
		"build": "bunx --bun vite build",
		"test": "bunx --bun vitest run --project server",
```

Also change `"test:unit": "vitest"` → `"test:unit": "bunx --bun vitest"`.

- [ ] **Step 3: Externalize `db` from the bundle**

In `apps/client/vite.config.ts`, add `ssr` right after the `plugins` line:

```ts
	plugins: [tailwindcss(), sveltekit()],
	ssr: { external: ['db'] },
```

- [ ] **Step 4: Enable experimental remote functions + async**

In `apps/client/svelte.config.js`, update `compilerOptions` and `kit`:

```js
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true),
		experimental: { async: true }
	},
	kit: {
		adapter: adapter(),
		experimental: { remoteFunctions: true }
	}
```

- [ ] **Step 5: turbo — build deps before dev**

In `turbo.json`, change the `dev` task to:

```json
		"dev": {
			"cache": false,
			"persistent": true,
			"dependsOn": ["^build"]
		},
```

- [ ] **Step 6: Install + commit**

```bash
bun install
git add apps/client/package.json apps/client/vite.config.ts apps/client/svelte.config.js turbo.json bun.lock
git commit -m "chore(client): bun-forced build/dev/test, externalize db, enable remote functions + async"
```

---

## Task 4: Server repository (db-backed)

**Files:**
- Create: `apps/client/src/lib/server/repository.ts`, `apps/client/src/lib/server/repository.test.ts`
- Delete: `apps/client/src/lib/data/repository.ts`, `apps/client/src/lib/data/repository.test.ts`

- [ ] **Step 1: Create the db-backed repository**

Create `apps/client/src/lib/server/repository.ts`:

```ts
import {
	db,
	set as setTable,
	subset as subsetTable,
	case_ as caseTable,
	algorithm as algorithmTable
} from 'db';
import type { Algorithm, Case, CaseWithContext, Set, SidebarSet, Subset } from '$lib/data/types';

const sets = db.select().from(setTable).all() as Set[];
const subsets = db.select().from(subsetTable).all() as Subset[];
const cases = db.select().from(caseTable).all() as Case[];
const algorithms = db.select().from(algorithmTable).all() as Algorithm[];

const setsById = new Map(sets.map((s) => [s.id, s]));
const subsetsById = new Map(subsets.map((s) => [s.id, s]));

const subsetsBySet = new Map<string, Subset[]>();
for (const s of subsets) {
	const list = subsetsBySet.get(s.setId) ?? [];
	list.push(s);
	subsetsBySet.set(s.setId, list);
}

const casesBySubset = new Map<string, Case[]>();
for (const c of cases) {
	const list = casesBySubset.get(c.subsetId) ?? [];
	list.push(c);
	casesBySubset.set(c.subsetId, list);
}

const algorithmsByCase = new Map<string, Algorithm[]>();
for (const a of algorithms) {
	const list = algorithmsByCase.get(a.caseId) ?? [];
	list.push(a);
	algorithmsByCase.set(a.caseId, list);
}

const buildContext = (c: Case): CaseWithContext => {
	const subset = subsetsById.get(c.subsetId);
	if (!subset) throw new Error(`Subset ${c.subsetId} not found for case ${c.id}`);
	const set = setsById.get(subset.setId);
	if (!set) throw new Error(`Set ${subset.setId} not found for subset ${subset.id}`);

	const list = algorithmsByCase.get(c.id) ?? [];
	const main = list.filter((a) => a.id === c.defaultAlgorithmId);
	const rest = list.filter((a) => a.id !== c.defaultAlgorithmId);

	return {
		id: c.id,
		name: c.name,
		setup: c.setup,
		viewType: set.viewType,
		set,
		subset,
		algorithms: [...main, ...rest]
	};
};

export const getSets = (): Set[] => sets;
export const findSet = (setId: string): Set | undefined => setsById.get(setId);
export const findSubset = (subsetId: string): Subset | undefined => subsetsById.get(subsetId);
export const getSetSubsets = (setId: string): Subset[] => subsetsBySet.get(setId) ?? [];

export const getSubsetCases = (subsetId: string): CaseWithContext[] =>
	(casesBySubset.get(subsetId) ?? []).map(buildContext);

export const getSetCases = (setId: string): CaseWithContext[] =>
	getSetSubsets(setId).flatMap((s) => getSubsetCases(s.id));

export const getAllCases = (): CaseWithContext[] => cases.map(buildContext);

export const getCase = (caseId: string): CaseWithContext | undefined => {
	const found = cases.find((c) => c.id === caseId);
	return found ? buildContext(found) : undefined;
};

export const getSidebarTree = (): SidebarSet[] =>
	sets.map((set) => ({
		...set,
		subsets: getSetSubsets(set.id).map((subset) => ({
			...subset,
			cases: (casesBySubset.get(subset.id) ?? []).map((c) => ({ id: c.id, name: c.name }))
		}))
	}));
```

- [ ] **Step 2: Move the repository test**

Create `apps/client/src/lib/server/repository.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
	getAllCases,
	getCase,
	getSetCases,
	getSets,
	getSidebarTree,
	getSubsetCases
} from './repository';

describe('repository', () => {
	it('returns all sets', () => {
		expect(
			getSets()
				.map((s) => s.id)
				.sort()
		).toEqual(['F2L', 'OLL', 'PLL']);
	});

	it('assembles a case with resolved context and the default algorithm first', () => {
		expect(getAllCases()).toHaveLength(29);

		const oll21 = getCase('OLL-21');
		expect(oll21).toBeDefined();
		expect(oll21!.viewType).toBe('OLL'); // inherited from its set
		expect(oll21!.subset.id).toBe('Oriented-Edges');
		expect(oll21!.set.id).toBe('OLL');
		expect(oll21!.algorithms[0].id).toBe('OLL-21__0');
		expect(oll21!.algorithms.length).toBeGreaterThan(0);
	});

	it('groups cases by set and subset consistently', () => {
		const setTotal = getSets().reduce((n, s) => n + getSetCases(s.id).length, 0);
		expect(setTotal).toBe(29);
		expect(getSubsetCases('Oriented-Edges').every((c) => c.subset.id === 'Oriented-Edges')).toBe(
			true
		);
	});

	it('builds a sidebar tree with nested subsets and cases', () => {
		const tree = getSidebarTree();
		expect(tree.map((s) => s.id).sort()).toEqual(['F2L', 'OLL', 'PLL']);
		const oll = tree.find((s) => s.id === 'OLL')!;
		expect(oll.subsets.length).toBeGreaterThan(0);
		expect(oll.subsets[0].cases.length).toBeGreaterThan(0);
	});
});
```

Then delete the originals:

```bash
git rm apps/client/src/lib/data/repository.ts apps/client/src/lib/data/repository.test.ts
```

- [ ] **Step 3: Run the test under Bun**

Run: `cd apps/client && bunx --bun vitest run --project server src/lib/server/repository.test.ts`
Expected: PASS (29 cases, OLL-21 → OLL-21__0, sets F2L/OLL/PLL) — same assertions, now against `db`.

- [ ] **Step 4: Commit**

```bash
git add apps/client/src/lib/server/
git commit -m "feat(client): db-backed repository in \$lib/server"
```

---

## Task 5: Breadcrumbs from the sidebar tree

The layout no longer has a per-page `load` to supply breadcrumbs. Derive them (pure) from the already-fetched sidebar tree + route params.

**Files:**
- Modify: `apps/client/src/lib/data/breadcrumbs.ts`, `apps/client/src/lib/data/breadcrumbs.test.ts`

- [ ] **Step 1: Rewrite the failing test**

Replace `apps/client/src/lib/data/breadcrumbs.test.ts` with:

```ts
import { describe, expect, it } from 'vitest';
import { getBreadcrumbs } from './breadcrumbs';
import type { SidebarSet } from './types';

const tree: SidebarSet[] = [
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
];

describe('getBreadcrumbs', () => {
	it('always starts with the Algorithms root', () => {
		expect(getBreadcrumbs(tree, {})).toEqual([{ name: 'Algorithms', href: '/' }]);
	});

	it('builds nested crumbs for set/subset/case from the tree', () => {
		expect(
			getBreadcrumbs(tree, { setId: 'OLL', subsetId: 'Oriented-Edges', caseId: 'OLL-21' })
		).toEqual([
			{ name: 'Algorithms', href: '/' },
			{ name: 'OLL', href: '/OLL' },
			{ name: 'Oriented Edges', href: '/OLL/Oriented-Edges' },
			{ name: 'Cross', href: '/OLL/Oriented-Edges/OLL-21' }
		]);
	});
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `cd apps/client && bunx --bun vitest run --project server src/lib/data/breadcrumbs.test.ts`
Expected: FAIL (old signature takes an object, not `(tree, params)`).

- [ ] **Step 3: Rewrite breadcrumbs.ts**

Replace `apps/client/src/lib/data/breadcrumbs.ts` with:

```ts
import type { Breadcrumb, SidebarSet } from './types';

export const getBreadcrumbs = (
	tree: SidebarSet[],
	params: Record<string, string>
): Breadcrumb[] => {
	const crumbs: Breadcrumb[] = [{ name: 'Algorithms', href: '/' }];

	const set = params.setId ? tree.find((s) => s.id === params.setId) : undefined;
	if (!set) return crumbs;
	crumbs.push({ name: set.name, href: `/${set.id}` });

	const subset = params.subsetId ? set.subsets.find((s) => s.id === params.subsetId) : undefined;
	if (!subset) return crumbs;
	crumbs.push({ name: subset.name, href: `/${set.id}/${subset.id}` });

	const c = params.caseId ? subset.cases.find((x) => x.id === params.caseId) : undefined;
	if (!c) return crumbs;
	crumbs.push({ name: c.name, href: `/${set.id}/${subset.id}/${c.id}` });

	return crumbs;
};
```

- [ ] **Step 4: Run it to confirm it passes**

Run: `cd apps/client && bunx --bun vitest run --project server src/lib/data/breadcrumbs.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/client/src/lib/data/breadcrumbs.ts apps/client/src/lib/data/breadcrumbs.test.ts
git commit -m "feat(client): derive breadcrumbs from sidebar tree + params"
```

---

## Task 6: Remote functions

**Files:**
- Create: `apps/client/src/lib/data/catalog.remote.ts`

- [ ] **Step 1: Create the remote module**

Create `apps/client/src/lib/data/catalog.remote.ts`:

```ts
import { error } from '@sveltejs/kit';
import { prerender } from '$app/server';
import { z } from 'zod';
import * as repo from '$lib/server/repository';
import type { PreviewItem } from './types';

export const getSidebar = prerender(() => repo.getSidebarTree());

export const getHomeView = prerender(() => {
	const sets = repo.getSets();
	const cases = repo.getAllCases();
	const items: PreviewItem[] = [
		{ href: '/', name: 'All', previewAlgorithm: '', size: cases.length, viewType: 'PLL', all: true },
		...sets.map((set) => ({
			href: `/${set.id}`,
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
	const subsets = repo.getSetSubsets(set.id);
	const cases = repo.getSetCases(set.id);
	const items: PreviewItem[] = [
		{ href: `/${set.id}`, name: 'All', previewAlgorithm: '', size: cases.length, viewType: set.viewType },
		...subsets.map((subset) => ({
			href: `/${set.id}/${subset.id}`,
			name: subset.name,
			previewAlgorithm: subset.previewAlgorithm,
			size: repo.getSubsetCases(subset.id).length,
			viewType: set.viewType
		}))
	];
	return { items, cases };
});

export const getSubsetView = prerender(
	z.object({ setId: z.string(), subsetId: z.string() }),
	({ setId, subsetId }) => {
		const set = repo.findSet(setId);
		const subset = repo.findSubset(subsetId);
		if (!set || !subset) error(404, 'Not found');
		const subsets = repo.getSetSubsets(set.id);
		const cases = repo.getSubsetCases(subset.id);
		const items: PreviewItem[] = [
			{ href: `/${set.id}`, name: 'All', previewAlgorithm: '', size: repo.getSetCases(set.id).length, viewType: set.viewType },
			...subsets.map((s) => ({
				href: `/${set.id}/${s.id}`,
				name: s.name,
				previewAlgorithm: s.previewAlgorithm,
				size: repo.getSubsetCases(s.id).length,
				viewType: set.viewType
			}))
		];
		return { items, cases };
	}
);

export const getCaseView = prerender(z.string(), (caseId) => {
	const c = repo.getCase(caseId);
	if (!c) error(404, 'Case not found');
	return c;
});
```

- [ ] **Step 2: Commit**

```bash
git add apps/client/src/lib/data/catalog.remote.ts
git commit -m "feat(client): prerender remote functions over the repository (zod-validated)"
```

*(No standalone test: these are thin wrappers over the repository, exercised by the build in Task 8.)*

---

## Task 7: Layout — sidebar + breadcrumbs via remote

**Files:**
- Modify: `apps/client/src/routes/+layout.ts`, `apps/client/src/routes/+layout.svelte`

- [ ] **Step 1: Reduce `+layout.ts` to the prerender flag**

Replace `apps/client/src/routes/+layout.ts` with:

```ts
export const prerender = true;
```

- [ ] **Step 2: Rewrite `+layout.svelte`**

Replace `apps/client/src/routes/+layout.svelte` with:

```svelte
<script lang="ts">
	import './layout.css';
	import { Menu } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import AppSidebar from '$lib/layout/AppSidebar.svelte';
	import { getBreadcrumbs } from '$lib/data/breadcrumbs';
	import { getSidebar } from '$lib/data/catalog.remote';

	let { children }: { children: Snippet } = $props();

	const sidebar = await getSidebar();
</script>

<svelte:head>
	<title>My Cubing Algs</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<svelte:boundary>
	<div class="drawer lg:drawer-open">
		<input id="app-drawer" type="checkbox" class="drawer-toggle" />
		<div class="drawer-content flex min-h-screen flex-col bg-base-200">
			<header class="navbar sticky top-0 z-20 border-b border-base-300 bg-base-100/85 backdrop-blur">
				<label for="app-drawer" class="btn btn-square btn-ghost lg:hidden" aria-label="Open sidebar">
					<Menu class="size-5" />
				</label>
				<div class="flex-1">
					<Breadcrumbs breadcrumbs={getBreadcrumbs(sidebar, page.params)} />
				</div>
				<ThemeToggle />
			</header>
			<main class="flex-1 p-4 sm:p-6">
				<div class="mx-auto w-full max-w-5xl">
					{@render children()}
				</div>
			</main>
		</div>
		<div class="drawer-side z-30">
			<label for="app-drawer" class="drawer-overlay" aria-label="Close sidebar"></label>
			<AppSidebar {sidebar} />
		</div>
	</div>

	{#snippet pending()}
		<div class="flex min-h-screen items-center justify-center bg-base-200">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	{/snippet}
</svelte:boundary>
```

- [ ] **Step 3: Commit**

```bash
git add apps/client/src/routes/+layout.ts apps/client/src/routes/+layout.svelte
git commit -m "feat(client): layout sidebar + breadcrumbs via remote function"
```

---

## Task 8: Pages — data via remote functions

**Files:**
- Modify: `apps/client/src/routes/+page.svelte`, `[setId]/+page.svelte`, `[setId]/[subsetId]/+page.svelte`, `[setId]/[subsetId]/[caseId]/+page.svelte`
- Create: `[setId]/+page.server.ts`, `[setId]/[subsetId]/+page.server.ts`, `[setId]/[subsetId]/[caseId]/+page.server.ts`
- Delete: `+page.ts`, `[setId]/+page.ts`, `[setId]/[subsetId]/+page.ts`, `[setId]/[subsetId]/[caseId]/+page.ts`

- [ ] **Step 1: Home page**

Replace `apps/client/src/routes/+page.svelte`:

```svelte
<script lang="ts">
	import CasesList from '$lib/components/CasesList.svelte';
	import PreviewList from '$lib/components/PreviewList.svelte';
	import { getHomeView } from '$lib/data/catalog.remote';

	const view = await getHomeView();
</script>

<svelte:boundary>
	<PreviewList items={view.items} />
	<div class="mt-2 flex flex-col gap-2">
		<CasesList cases={view.cases} slim />
	</div>

	{#snippet pending()}
		<span class="loading loading-spinner"></span>
	{/snippet}
</svelte:boundary>
```

Then: `git rm apps/client/src/routes/+page.ts`

- [ ] **Step 2: Set page (reactive to params)**

Replace `apps/client/src/routes/[setId]/+page.svelte`:

```svelte
<script lang="ts">
	import { page } from '$app/state';
	import CasesList from '$lib/components/CasesList.svelte';
	import PreviewList from '$lib/components/PreviewList.svelte';
	import { getSetView } from '$lib/data/catalog.remote';

	const view = $derived(await getSetView(page.params.setId));
</script>

<svelte:boundary>
	<PreviewList items={view.items} />
	<div class="mt-2 flex flex-col gap-2">
		<CasesList cases={view.cases} slim />
	</div>

	{#snippet pending()}
		<span class="loading loading-spinner"></span>
	{/snippet}
</svelte:boundary>
```

Create `apps/client/src/routes/[setId]/+page.server.ts`:

```ts
import * as repo from '$lib/server/repository';

export const prerender = true;

export const entries = () => repo.getSets().map((set) => ({ setId: set.id }));
```

Then: `git rm apps/client/src/routes/[setId]/+page.ts`

- [ ] **Step 3: Subset page**

Replace `apps/client/src/routes/[setId]/[subsetId]/+page.svelte`:

```svelte
<script lang="ts">
	import { page } from '$app/state';
	import CasesList from '$lib/components/CasesList.svelte';
	import PreviewList from '$lib/components/PreviewList.svelte';
	import { getSubsetView } from '$lib/data/catalog.remote';

	const view = $derived(
		await getSubsetView({ setId: page.params.setId, subsetId: page.params.subsetId })
	);
</script>

<svelte:boundary>
	<PreviewList items={view.items} />
	<div class="mt-2 flex flex-col gap-2">
		<CasesList cases={view.cases} slim />
	</div>

	{#snippet pending()}
		<span class="loading loading-spinner"></span>
	{/snippet}
</svelte:boundary>
```

Create `apps/client/src/routes/[setId]/[subsetId]/+page.server.ts`:

```ts
import * as repo from '$lib/server/repository';

export const prerender = true;

export const entries = () =>
	repo.getSets().flatMap((set) =>
		repo.getSetSubsets(set.id).map((subset) => ({ setId: set.id, subsetId: subset.id }))
	);
```

Then: `git rm "apps/client/src/routes/[setId]/[subsetId]/+page.ts"`

- [ ] **Step 4: Case page**

Replace `apps/client/src/routes/[setId]/[subsetId]/[caseId]/+page.svelte`:

```svelte
<script lang="ts">
	import { page } from '$app/state';
	import CaseView from '$lib/components/CaseView.svelte';
	import { getCaseView } from '$lib/data/catalog.remote';

	const currentCase = $derived(await getCaseView(page.params.caseId));
</script>

<svelte:boundary>
	<CaseView case={currentCase} slim={false} />

	{#snippet pending()}
		<span class="loading loading-spinner"></span>
	{/snippet}
</svelte:boundary>
```

Create `apps/client/src/routes/[setId]/[subsetId]/[caseId]/+page.server.ts`:

```ts
import * as repo from '$lib/server/repository';

export const prerender = true;

export const entries = () =>
	repo.getSets().flatMap((set) =>
		repo.getSetSubsets(set.id).flatMap((subset) =>
			repo.getSubsetCases(subset.id).map((c) => ({
				setId: set.id,
				subsetId: subset.id,
				caseId: c.id
			}))
		)
	);
```

Then: `git rm "apps/client/src/routes/[setId]/[subsetId]/[caseId]/+page.ts"`

- [ ] **Step 5: Build (proves prerender + remote capture + adapter)**

Run: `bun run --filter client build`
Expected: `✓ built`, `Using @sveltejs/adapter-cloudflare ✔ done`, exit 0.

Verify the real data is prerendered and the Worker is clean:
```bash
cd apps/client
grep -o "OLL-21" .svelte-kit/cloudflare/OLL/Oriented-Edges/OLL-21.html | head -1
grep -c "bun:sqlite\|db.sqlite\|drizzle" .svelte-kit/cloudflare/_worker.js
ls .svelte-kit/cloudflare/_app/remote
```
Expected: `OLL-21` present in the case HTML; worker count `0`; a `remote/` dir exists.

- [ ] **Step 6: Commit**

```bash
git add apps/client/src/routes
git commit -m "feat(client): pages fetch data via remote functions + async boundaries"
```

---

## Task 9: Remove the JSON tables

**Files:**
- Delete: `apps/client/src/lib/data/tables/`, `apps/client/src/lib/data/tables.test.ts`, `packages/db/seed.ts`

- [ ] **Step 1: Delete**

```bash
git rm -r apps/client/src/lib/data/tables apps/client/src/lib/data/tables.test.ts packages/db/seed.ts
```

- [ ] **Step 2: Verify nothing references them**

Run: `grep -rn "tables/" apps/client/src; grep -rn "from './tables" apps/client/src` (from repo root)
Expected: no matches.

- [ ] **Step 3: Build again to confirm the seed/JSON were not load-bearing**

Run: `bun run --filter client build`
Expected: exit 0 (data now comes solely from `db.sqlite`).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove JSON tables and one-time seed (db.sqlite is the source)"
```

---

## Task 10: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Type check**

Run: `cd apps/client && bun run check`
Expected: 0 errors. *(If `svelte-check` flags the experimental `await`/`$derived(await …)` usage, note it; the build is the source of truth — but resolve type errors before proceeding. Watch for: `page.params` typing, remote return types.)*

- [ ] **Step 2: Unit tests**

Run: `cd apps/client && bun run test`
Expected: repository (29 cases, OLL-21) + breadcrumbs suites PASS under Bun.

- [ ] **Step 3: Lint**

Run: `cd apps/client && bun run lint`
Expected: clean (run `bun run format` first if Prettier complains).

- [ ] **Step 4: Build (root, via turbo — mirrors CI)**

Run: `bun run build`
Expected: `db#build` then `client#build` both succeed.

- [ ] **Step 5: Preview + manual nav check (reactivity of `$derived(await …)`)**

Run: `cd apps/client && bun run preview`
Then verify in the browser preview: home renders sets + cases; the sidebar lists all sets/subsets/cases; navigating between two cases (e.g. `/OLL/Oriented-Edges/OLL-21` → another case) updates the `CaseView` and breadcrumbs (confirms client-side reactivity). *(If a param page does NOT update on client-side navigation, switch that page from `$derived(await getX(page.params…))` to the markup form `{#await getX(page.params…)}…{:then view}…{/await}`, which is reactive by construction; rebuild and re-verify.)*

- [ ] **Step 6: Final commit (if any fixes were needed)**

```bash
git add -A
git commit -m "test: verify db-backed remote-function data layer end-to-end"
```

---

## Notes for the implementer

- **Correction applied during execution (Tasks 7–8):** do NOT wrap awaited remote
  data in `<svelte:boundary>` with a `pending` snippet. A pending boundary is
  rendered during SSR/prerender and the awaited content is *ignored* — so data is
  not inlined into the HTML (only a spinner ships, then hydrates). Instead put the
  `await` at the top of the component, *outside* any boundary: top-level
  `const x = await fn()` for param-free components (layout, home) and
  `const x = $derived(await fn(page.params.id!))` for param-dependent pages.
  SvelteKit awaits these during prerender (data inlined) and `$derived(await …)`
  stays reactive on client-side navigation. The committed components omit the
  boundaries shown in the Task 7–8 code blocks. (Refs:
  https://svelte.dev/docs/kit/remote-functions, https://svelte.dev/docs/svelte/await-expressions)
- **`page.params.<x>`** from `$app/state` is typed `string | undefined` (the
  app-wide union), so assert non-null when passing to a remote arg:
  `getCaseView(page.params.caseId!)`.
- **Always invoke client build/dev/test through the npm scripts** (which carry `bunx --bun`). A bare `vite build`/`vitest` under Node fails with `ERR_UNSUPPORTED_ESM_URL_SCHEME … protocol 'bun:'`.
- **After editing `packages/db/db.sqlite`** (e.g. via Drizzle Studio), rerun `bun run --filter db build` so the externalized `db` resolves the latest file before a client build.
- The stable fallback for the whole data layer, if an experimental API regresses, is server `load`s over the same `$lib/server/repository.ts` (no remote functions / async).
