# SvelteKit + daisyUI Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the Rubik's-cube algorithm reference app from `apps/client-legacy` (Astro 5 + React 19 + shadcn/ui) to `apps/client` (SvelteKit 2 + Svelte 5 + daisyUI 5), as a statically-prerendered site, reusing the `packages/cube` engine unchanged.

**Architecture:** File-based SvelteKit routes (`/`, `/[setId]`, `/[setId]/[subsetId]`, `/[setId]/[subsetId]/[caseId]`), all prerendered via `adapter-static`. Data comes from the legacy JSON, normalized into five db-mirrored tables behind a synchronous repository (so swapping to the real `packages/db` later stays localized). UI is daisyUI components; the 2D cube visualization is a near-verbatim Svelte port of the legacy components.

**Tech Stack:** SvelteKit 2, Svelte 5 (runes), Tailwind CSS 4, daisyUI 5, `@lucide/svelte`, Vitest (node project for logic), `packages/cube` (workspace).

**Reference spec:** `docs/superpowers/specs/2026-06-03-sveltekit-daisyui-migration-design.md`

---

## Conventions for the executor

- **All shell commands run from `apps/client/` unless stated otherwise.** (The data-transform script and the root `CLAUDE.md` task are the exceptions — they're called out explicitly.)
- **Package manager is `bun`.** Use `bun install`, `bun run <script>`, `bunx <tool>`.
- **Run unit tests in the node project only** (the browser/Playwright project is not needed for this plan): `bunx vitest run --project server <path>`.
- **When writing any `.svelte` file**, after creating it run the Svelte MCP `svelte-autofixer` on the file's contents and apply its suggestions until it reports none. Use the Svelte MCP `list-sections` / `get-documentation` tools if unsure about Svelte 5 / SvelteKit APIs (runes, snippets, `$app/state`, prerender/`entries`).
- **When writing daisyUI markup**, follow the daisyUI skill's component class names (drawer, menu, card, badge, breadcrumbs, divider, input).
- **`packages/cube` API used here:** `algorithmToFaces`, `applyRotations`, `createCube`, `isCubeSolved`, `rotationsFromString`, `toColoredFaceSlices`, `getAdjacentPieces`, and types `Colors` (enum), `Faces` (enum), `ColorOrientation`, `AdjacentPieces`, `FaceSlice`.
- **Svelte 5 prop typing pattern** used throughout:
  ```svelte
  <script lang="ts">
    interface Props { foo: string; bar?: number }
    let { foo, bar = 0 }: Props = $props();
  </script>
  ```
- **Data model (db-mirrored).** `ViewType = 'F2L' | 'OLL' | 'PLL'`. `cube` is data-only (single `3x3`); navigation is `set → subset → case`. `viewType` lives on `set` and is inherited by subset/case. Each algorithm is its own row; a case points at its `defaultAlgorithmId` (the "main" algorithm).

---

## Task 1: Project setup — deps, adapter-static, CSS, theme bootstrap, cleanup

**Files:**
- Modify: `apps/client/package.json`
- Modify: `apps/client/svelte.config.js`
- Modify: `apps/client/src/routes/layout.css`
- Modify: `apps/client/src/app.html`
- Create: `apps/client/src/routes/+layout.ts`
- Modify: `apps/client/src/routes/+page.svelte`
- Delete: `apps/client/src/routes/demo/` (recursively), `apps/client/src/lib/vitest-examples/`, `apps/client/src/lib/index.ts`, `apps/client/pnpm-lock.yaml`

- [ ] **Step 1: Add/remove dependencies**

Edit `apps/client/package.json`. In `devDependencies` replace `"@sveltejs/adapter-auto"` with `"@sveltejs/adapter-static": "^3.0.10"`. Add to a `dependencies` block (create it if missing):

```json
  "dependencies": {
    "@lucide/svelte": "^1.17.0",
    "cube": "workspace:*"
  },
```

Then remove the stray lockfile and install:

```bash
rm -f pnpm-lock.yaml
bun install
```

Expected: `bun install` completes; `node_modules/@sveltejs/adapter-static` and `node_modules/cube` exist.

- [ ] **Step 2: Switch the adapter to adapter-static**

Replace `apps/client/svelte.config.js` with:

```js
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter()
	}
};

export default config;
```

- [ ] **Step 3: Set up the app stylesheet (Tailwind + daisyUI + cube theme tokens)**

Replace `apps/client/src/routes/layout.css` with:

```css
@import 'tailwindcss';

@plugin 'daisyui' {
	themes: dark --default, light;
}

@theme {
	--color-cube-green: #009b48;
	--color-cube-red: #b90000;
	--color-cube-blue: #0045ad;
	--color-cube-orange: #ff5900;
	--color-cube-white: #ffffff;
	--color-cube-yellow: #ffd500;
	--color-cube-blank: #808080;
	--grid-template-columns-cube: 1fr repeat(3, 5fr) 1fr;
	--grid-template-columns-cube-flat: 0 repeat(3, 5fr) 0;
	--grid-template-rows-cube: 1fr repeat(3, 5fr) 1fr;
	--grid-template-rows-cube-flat: 0 repeat(3, 5fr) 0;
}
```

- [ ] **Step 4: Bootstrap the theme in `app.html` (default dark, no FOUC)**

Replace `apps/client/src/app.html` with:

```html
<!doctype html>
<html lang="en" data-theme="dark">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<script>
			try {
				const t = localStorage.getItem('theme');
				if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
			} catch (e) {}
		</script>
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

- [ ] **Step 5: Make the whole app prerenderable**

Create `apps/client/src/routes/+layout.ts`:

```ts
export const prerender = true;
```

- [ ] **Step 6: Replace the welcome page with a temporary placeholder**

Replace `apps/client/src/routes/+page.svelte` with:

```svelte
<h1 class="p-4 text-2xl">Cubing — migration in progress</h1>
```

- [ ] **Step 7: Delete scaffold/demo files**

```bash
rm -rf src/routes/demo
rm -rf src/lib/vitest-examples
rm -f src/lib/index.ts
```

- [ ] **Step 8: Verify it builds and type-checks**

```bash
bun run check
bun run build
```

Expected: `bun run check` reports 0 errors; `bun run build` completes and writes a `build/` directory containing `index.html`. (adapter-static prerenders the single placeholder route.)

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore(client): adapter-static, daisyUI + cube theme, theme bootstrap, remove scaffold"
```

---

## Task 2: Normalized, db-mirrored data tables + transform script

**Files:**
- Create: `apps/client/scripts/transform-legacy-data.ts`
- Create (generated): `apps/client/src/lib/data/tables/{cube,set,subset,case,algorithm}.json`
- Test: `apps/client/src/lib/data/tables.test.ts`

- [ ] **Step 1: Write the failing integrity test**

Create `apps/client/src/lib/data/tables.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import cube from './tables/cube.json';
import set from './tables/set.json';
import subset from './tables/subset.json';
import caseRows from './tables/case.json';
import algorithm from './tables/algorithm.json';

describe('normalized data tables', () => {
	it('has the expected row counts', () => {
		expect(cube).toHaveLength(1);
		expect(set).toHaveLength(3);
		expect(subset).toHaveLength(7);
		expect(caseRows).toHaveLength(29);
		expect(algorithm).toHaveLength(37);
	});

	it('has valid foreign keys and resolvable default algorithms', () => {
		const cubeIds = new Set(cube.map((c) => c.id));
		const setIds = new Set(set.map((s) => s.id));
		const subsetIds = new Set(subset.map((s) => s.id));
		const caseIds = new Set(caseRows.map((c) => c.id));
		const algorithmIds = new Set(algorithm.map((a) => a.id));

		expect(set.every((s) => cubeIds.has(s.cubeId))).toBe(true);
		expect(subset.every((s) => setIds.has(s.setId))).toBe(true);
		expect(caseRows.every((c) => subsetIds.has(c.subsetId))).toBe(true);
		expect(algorithm.every((a) => caseIds.has(a.caseId))).toBe(true);
		expect(
			caseRows.every((c) => c.defaultAlgorithmId !== null && algorithmIds.has(c.defaultAlgorithmId))
		).toBe(true);
	});
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
bunx vitest run --project server src/lib/data/tables.test.ts
```

Expected: FAIL — modules `./tables/*.json` cannot be resolved (files don't exist yet).

- [ ] **Step 3: Write the transform script**

Create `apps/client/scripts/transform-legacy-data.ts`:

```ts
/**
 * One-off transform: legacy JSON (apps/client-legacy/src/data) -> normalized
 * tables mirroring packages/db/schema.ts (apps/client/src/lib/data/tables).
 * Run with: bun scripts/transform-legacy-data.ts
 * Kept for provenance and as the basis for a future db seed.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import setsJson from '../../client-legacy/src/data/sets.json';
import subsetsJson from '../../client-legacy/src/data/subsets.json';
import casesJson from '../../client-legacy/src/data/cases.json';

const outDir = resolve(import.meta.dir, '../src/lib/data/tables');
mkdirSync(outDir, { recursive: true });

const cube = [{ id: '3x3', name: '3x3' }];

const set = setsJson.map((s) => ({
	id: s.id,
	name: s.name,
	previewAlgorithm: '',
	cubeId: '3x3',
	viewType: s.viewType
}));

const subset = subsetsJson.map((s) => ({
	id: s.id,
	name: s.name,
	previewAlgorithm: s.previewAlgorithm,
	setId: s.setId
}));

const caseRows: unknown[] = [];
const algorithm: unknown[] = [];

for (const c of casesJson) {
	let defaultAlgorithmId: string | null = null;
	c.algorithms.forEach((a, i) => {
		const id = `${c.id}__${i}`;
		if (i === 0) defaultAlgorithmId = id;
		algorithm.push({
			id,
			name: `${c.name} ${i + 1}`,
			caseId: c.id,
			rotations: a.rotations,
			mnemonics: a.rotationsMnemonic,
			description: a.description
		});
	});
	caseRows.push({
		id: c.id,
		name: c.name,
		setup: c.setup,
		subsetId: c.subsetId,
		defaultAlgorithmId
	});
}

const write = (name: string, rows: unknown[]) =>
	writeFileSync(resolve(outDir, `${name}.json`), JSON.stringify(rows, null, '\t') + '\n');

write('cube', cube);
write('set', set);
write('subset', subset);
write('case', caseRows);
write('algorithm', algorithm);

console.log(
	`Wrote ${cube.length} cube, ${set.length} set, ${subset.length} subset, ${caseRows.length} case, ${algorithm.length} algorithm rows to ${outDir}`
);
```

- [ ] **Step 4: Run the transform to generate the tables**

```bash
bun scripts/transform-legacy-data.ts
```

Expected: prints `Wrote 1 cube, 3 set, 7 subset, 29 case, 37 algorithm rows ...` and creates the five JSON files under `src/lib/data/tables/`.

- [ ] **Step 5: Run the integrity test to verify it passes**

```bash
bunx vitest run --project server src/lib/data/tables.test.ts
```

Expected: PASS (both tests).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(client): generate db-mirrored data tables from legacy JSON"
```

---

## Task 3: db-shaped types + repository

**Files:**
- Create: `apps/client/src/lib/data/types.ts`
- Create: `apps/client/src/lib/data/repository.ts`
- Test: `apps/client/src/lib/data/repository.test.ts`

- [ ] **Step 1: Define the types (mirror `packages/db/schema.ts`)**

Create `apps/client/src/lib/data/types.ts`:

```ts
export type ViewType = 'F2L' | 'OLL' | 'PLL';

export interface Cube {
	id: string;
	name: string;
}

export interface Set {
	id: string;
	name: string;
	previewAlgorithm: string;
	cubeId: string;
	viewType: ViewType;
}

export interface Subset {
	id: string;
	name: string;
	previewAlgorithm: string;
	setId: string;
}

export interface Case {
	id: string;
	name: string;
	setup: string;
	subsetId: string;
	defaultAlgorithmId: string | null;
}

export interface Algorithm {
	id: string;
	name: string;
	caseId: string;
	rotations: string;
	mnemonics: string | null;
	description: string | null;
}

/** View-model assembled by the repository for the UI. */
export interface CaseWithContext {
	id: string;
	name: string;
	setup: string;
	viewType: ViewType;
	set: Set;
	subset: Subset;
	/** Default algorithm first, then the rest in source order. */
	algorithms: Algorithm[];
}

export interface SidebarSubset extends Subset {
	cases: Array<Pick<Case, 'id' | 'name'>>;
}

export interface SidebarSet extends Set {
	subsets: SidebarSubset[];
}

export interface PreviewItem {
	href: string;
	name: string;
	previewAlgorithm: string;
	size: number;
	viewType: ViewType;
}

export interface Breadcrumb {
	name: string;
	href: string;
}
```

- [ ] **Step 2: Write the failing repository test**

Create `apps/client/src/lib/data/repository.test.ts`:

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
		expect(getSets().map((s) => s.id).sort()).toEqual(['F2L', 'OLL', 'PLL']);
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

- [ ] **Step 3: Run the test to verify it fails**

```bash
bunx vitest run --project server src/lib/data/repository.test.ts
```

Expected: FAIL — `./repository` does not exist.

- [ ] **Step 4: Implement the repository**

Create `apps/client/src/lib/data/repository.ts`:

```ts
import algorithmTable from './tables/algorithm.json';
import caseTable from './tables/case.json';
import setTable from './tables/set.json';
import subsetTable from './tables/subset.json';
import type { Algorithm, Case, CaseWithContext, Set, SidebarSet, Subset } from './types';

const sets = setTable as unknown as Set[];
const subsets = subsetTable as unknown as Subset[];
const cases = caseTable as unknown as Case[];
const algorithms = algorithmTable as unknown as Algorithm[];

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

- [ ] **Step 5: Run the test to verify it passes**

```bash
bunx vitest run --project server src/lib/data/repository.test.ts
```

Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(client): db-shaped types and JSON-backed repository"
```

---

## Task 4: Breadcrumbs helper

**Files:**
- Create: `apps/client/src/lib/data/breadcrumbs.ts`
- Test: `apps/client/src/lib/data/breadcrumbs.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/client/src/lib/data/breadcrumbs.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { getBreadcrumbs } from './breadcrumbs';

describe('getBreadcrumbs', () => {
	it('always starts with the Algorithms root', () => {
		expect(getBreadcrumbs()).toEqual([{ name: 'Algorithms', href: '/' }]);
	});

	it('builds nested crumbs for set/subset/case', () => {
		expect(
			getBreadcrumbs({
				set: { id: 'OLL', name: 'OLL' },
				subset: { id: 'Oriented-Edges', name: 'Oriented Edges' },
				case: { id: 'OLL-21', name: 'Cross' }
			})
		).toEqual([
			{ name: 'Algorithms', href: '/' },
			{ name: 'OLL', href: '/OLL' },
			{ name: 'Oriented Edges', href: '/OLL/Oriented-Edges' },
			{ name: 'Cross', href: '/OLL/Oriented-Edges/OLL-21' }
		]);
	});
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
bunx vitest run --project server src/lib/data/breadcrumbs.test.ts
```

Expected: FAIL — `./breadcrumbs` does not exist.

- [ ] **Step 3: Implement the helper**

Create `apps/client/src/lib/data/breadcrumbs.ts`:

```ts
import type { Breadcrumb } from './types';

interface Entity {
	id: string;
	name: string;
}

interface GetBreadcrumbsParams {
	set?: Entity;
	subset?: Entity;
	case?: Entity;
}

export const getBreadcrumbs = ({ set, subset, case: c }: GetBreadcrumbsParams = {}): Breadcrumb[] => {
	const breadcrumbs: Breadcrumb[] = [{ name: 'Algorithms', href: '/' }];

	if (set) breadcrumbs.push({ name: set.name, href: `/${set.id}` });
	if (set && subset) breadcrumbs.push({ name: subset.name, href: `/${set.id}/${subset.id}` });
	if (set && subset && c)
		breadcrumbs.push({ name: c.name, href: `/${set.id}/${subset.id}/${c.id}` });

	return breadcrumbs;
};
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
bunx vitest run --project server src/lib/data/breadcrumbs.test.ts
```

Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(client): breadcrumbs helper"
```

---

## Task 5: Algorithm correctness checker (cube engine)

**Files:**
- Create: `apps/client/src/lib/cube/isAlgorithmCorrect.ts`
- Test: `apps/client/src/lib/cube/isAlgorithmCorrect.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/client/src/lib/cube/isAlgorithmCorrect.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { isAlgorithmCorrect } from './isAlgorithmCorrect';

describe('isAlgorithmCorrect', () => {
	it('treats a solved cube as correct for PLL', () => {
		expect(isAlgorithmCorrect('', '', 'PLL')).toBe(true);
	});

	it('treats a disturbed cube as incorrect for PLL', () => {
		expect(isAlgorithmCorrect('R', '', 'PLL')).toBe(false);
	});

	it('treats a uniform top layer as correct for OLL', () => {
		expect(isAlgorithmCorrect('', '', 'OLL')).toBe(true);
	});

	it('treats a broken top layer as incorrect for OLL', () => {
		expect(isAlgorithmCorrect('R', '', 'OLL')).toBe(false);
	});
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
bunx vitest run --project server src/lib/cube/isAlgorithmCorrect.test.ts
```

Expected: FAIL — `./isAlgorithmCorrect` does not exist.

- [ ] **Step 3: Implement the checker (ported from legacy `AlgorithmVerifier.astro`)**

Create `apps/client/src/lib/cube/isAlgorithmCorrect.ts`:

```ts
import {
	applyRotations,
	createCube,
	isCubeSolved,
	rotationsFromString,
	toColoredFaceSlices
} from 'cube';
import type { ViewType } from '$lib/data/types';

/**
 * Applies `setup` then `algorithm` to a solved cube and reports whether the
 * result counts as solved for the given view type. PLL requires a fully solved
 * cube; OLL/F2L only require a uniform (correctly oriented) top face.
 */
export const isAlgorithmCorrect = (
	setup: string,
	algorithm: string,
	viewType: ViewType
): boolean => {
	const operations = rotationsFromString(`${setup} ${algorithm}`);
	const scrambled = applyRotations(operations, createCube());

	if (viewType === 'PLL') {
		return isCubeSolved(scrambled);
	}

	const faces = toColoredFaceSlices(scrambled);
	return new Set(faces.U.flat()).size === 1;
};
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
bunx vitest run --project server src/lib/cube/isAlgorithmCorrect.test.ts
```

Expected: PASS (4 tests). If `$lib/data/types` fails to resolve in the node test, change that import to `../data/types` and re-run.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(client): algorithm correctness checker"
```

---

## Task 6: Cube primitives — `Piece` and `Face`

**Files:**
- Create: `apps/client/src/lib/components/cube/Piece.svelte`
- Create: `apps/client/src/lib/components/cube/Face.svelte`

> No unit test — these are presentational. They're type-checked here and rendered for real in Tasks 14+. After writing each file, run the Svelte MCP `svelte-autofixer` on it and apply suggestions until clean.

- [ ] **Step 1: Create `Piece.svelte`** (ported from `Piece.astro`; `cn` → Svelte class array; `blankColor` exported from a module script)

```svelte
<script lang="ts" module>
	export const blankColor = 'X';
</script>

<script lang="ts">
	import { Colors } from 'cube';

	interface Props {
		color?: Colors | typeof blankColor;
		class?: string;
	}

	let { color, class: className = '' }: Props = $props();
</script>

<div
	class={[
		className,
		'rounded',
		{
			'bg-cube-blank': color === blankColor,
			'bg-cube-green': color === Colors.G,
			'bg-cube-red': color === Colors.R,
			'bg-cube-blue': color === Colors.B,
			'bg-cube-orange': color === Colors.O,
			'bg-cube-yellow': color === Colors.Y,
			'bg-cube-white': color === Colors.W
		}
	]}
></div>
```

- [ ] **Step 2: Create `Face.svelte`** (ported from `Face.astro`; `{#if}` blocks replace Astro conditionals; the dangling `text-default-400` → `text-base-content/40`)

```svelte
<script lang="ts">
	import type { AdjacentPieces, Colors, FaceSlice, Faces } from 'cube';
	import Piece, { blankColor } from './Piece.svelte';

	interface Props {
		class?: string;
		face: FaceSlice<Colors>;
		maskedColors: (Colors | undefined)[];
		maskedAdjPieces?: Partial<AdjacentPieces<true | undefined>>;
		adjacentPieces?: AdjacentPieces<Colors>;
		faceLabel?: Faces;
	}

	let {
		class: className = '',
		face,
		maskedColors,
		maskedAdjPieces,
		adjacentPieces,
		faceLabel
	}: Props = $props();

	const maskedColorsSet = $derived(new Set(maskedColors));

	const mask = (color: Colors, hidden?: true): Colors | typeof blankColor | undefined =>
		hidden ? undefined : maskedColorsSet.has(color) ? blankColor : color;

	const pieces = $derived(face.flat().map((piece) => mask(piece)));
</script>

<div
	class={[
		'grid aspect-square h-full w-full grid-cols-cube grid-rows-cube gap-[2%]',
		{ 'grid-cols-cube-flat': !adjacentPieces, 'grid-rows-cube-flat': !adjacentPieces },
		className
	]}
>
	{#if adjacentPieces}
		<Piece class="col-start-2 row-start-1" color={mask(adjacentPieces.Top[0], maskedAdjPieces?.Top?.[0])} />
		<Piece class="col-start-3 row-start-1" color={mask(adjacentPieces.Top[1], maskedAdjPieces?.Top?.[1])} />
		<Piece class="col-start-4 row-start-1" color={mask(adjacentPieces.Top[2], maskedAdjPieces?.Top?.[2])} />
		<Piece class="col-start-1 row-start-2" color={mask(adjacentPieces.Left[0], maskedAdjPieces?.Left?.[0])} />
	{/if}

	<Piece class="col-start-2 row-start-2" color={pieces[0]} />
	<Piece class="col-start-3 row-start-2" color={pieces[1]} />
	<Piece class="col-start-4 row-start-2" color={pieces[2]} />

	{#if adjacentPieces}
		<Piece class="col-start-5 row-start-2" color={mask(adjacentPieces.Right[0], maskedAdjPieces?.Right?.[0])} />
		<Piece class="col-start-1 row-start-3" color={mask(adjacentPieces.Left[1], maskedAdjPieces?.Left?.[1])} />
	{/if}

	<Piece class="col-start-2 row-start-3" color={pieces[3]} />
	<Piece class="col-start-3 row-start-3" color={pieces[4]} />
	{#if faceLabel}
		<div
			class="relative col-start-3 row-start-3 flex select-none items-center justify-center text-2xl font-bold text-base-content/40"
		>
			{faceLabel}
		</div>
	{/if}
	<Piece class="col-start-4 row-start-3" color={pieces[5]} />

	{#if adjacentPieces}
		<Piece class="col-start-5 row-start-3" color={mask(adjacentPieces.Right[1], maskedAdjPieces?.Right?.[1])} />
		<Piece class="col-start-1 row-start-4" color={mask(adjacentPieces.Left[2], maskedAdjPieces?.Left?.[2])} />
	{/if}

	<Piece class="col-start-2 row-start-4" color={pieces[6]} />
	<Piece class="col-start-3 row-start-4" color={pieces[7]} />
	<Piece class="col-start-4 row-start-4" color={pieces[8]} />

	{#if adjacentPieces}
		<Piece class="col-start-5 row-start-4" color={mask(adjacentPieces.Right[2], maskedAdjPieces?.Right?.[2])} />
		<Piece class="col-start-2 row-start-5" color={mask(adjacentPieces.Bottom[0], maskedAdjPieces?.Bottom?.[0])} />
		<Piece class="col-start-3 row-start-5" color={mask(adjacentPieces.Bottom[1], maskedAdjPieces?.Bottom?.[1])} />
		<Piece class="col-start-4 row-start-5" color={mask(adjacentPieces.Bottom[2], maskedAdjPieces?.Bottom?.[2])} />
	{/if}
</div>
```

- [ ] **Step 3: Type-check**

```bash
bun run check
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(client): port cube Piece and Face components"
```

---

## Task 7: Cube views — `LastLayer`, `PLL`, `OLL`, `F2L`, `CubeView`

**Files:**
- Create: `apps/client/src/lib/components/cube/LastLayer.svelte`
- Create: `apps/client/src/lib/components/cube/PLL.svelte`
- Create: `apps/client/src/lib/components/cube/OLL.svelte`
- Create: `apps/client/src/lib/components/cube/F2L.svelte`
- Create: `apps/client/src/lib/components/cube/CubeView.svelte`

> Run `svelte-autofixer` on each. Visual correctness is verified in Tasks 14+ (these render real cubes there).

- [ ] **Step 1: Create `LastLayer.svelte`**

```svelte
<script lang="ts">
	import { algorithmToFaces, type ColorOrientation, Colors, Faces, getAdjacentPieces } from 'cube';
	import Face from './Face.svelte';

	interface Props {
		algorithm: string;
		maskedColors?: Colors[];
		orientation?: ColorOrientation;
	}

	let { algorithm, maskedColors = [], orientation = { U: Colors.Y, F: Colors.G } }: Props = $props();

	const faces = $derived(algorithmToFaces({ algorithm, orientation }));
	const adjacentColors = $derived(getAdjacentPieces(faces, Faces.U));
</script>

<Face face={faces.U} {maskedColors} adjacentPieces={adjacentColors} />
```

- [ ] **Step 2: Create `PLL.svelte`**

```svelte
<script lang="ts">
	import LastLayer from './LastLayer.svelte';

	interface Props {
		algorithm: string;
	}

	let { algorithm }: Props = $props();
</script>

<LastLayer {algorithm} />
```

- [ ] **Step 3: Create `OLL.svelte`**

```svelte
<script lang="ts">
	import { Colors } from 'cube';
	import LastLayer from './LastLayer.svelte';

	interface Props {
		algorithm: string;
	}

	let { algorithm }: Props = $props();
</script>

<LastLayer maskedColors={[Colors.B, Colors.G, Colors.O, Colors.R, Colors.W]} {algorithm} />
```

- [ ] **Step 4: Create `F2L.svelte`** (ported from `F2L.astro` — the isometric 3-face view)

```svelte
<script lang="ts">
	import { algorithmToFaces, Colors } from 'cube';
	import Face from './Face.svelte';

	interface Props {
		algorithm: string;
	}

	let { algorithm }: Props = $props();

	const faces = $derived(algorithmToFaces({ algorithm, orientation: { U: Colors.Y, F: Colors.R } }));
</script>

<div class="grid aspect-square origin-bottom-left scale-125 grid-cols-2 grid-rows-2">
	<Face
		class="row-start-1 h-1/2 origin-bottom-left -skew-x-45 translate-y-full"
		face={faces.U}
		maskedColors={[Colors.Y, Colors.B, Colors.O]}
	/>
	<Face class="row-start-2" face={faces.F} maskedColors={[Colors.Y, Colors.B, Colors.O]} />
	<Face
		class="row-start-2 w-1/2 origin-bottom-left -skew-y-45"
		face={faces.R}
		maskedColors={[Colors.Y, Colors.B, Colors.O]}
	/>
</div>
```

> **Skew note:** if the F2L view renders without its slanted/isometric look, Tailwind v4 may not emit `-skew-x-45` / `-skew-y-45` from the bare value. In that case change them to the arbitrary form `-skew-x-[45deg]` / `-skew-y-[45deg]` and re-check. Verify when the cube first renders (Task 14).

- [ ] **Step 5: Create `CubeView.svelte`** (dispatches by view type; `ViewType` now comes from `$lib/data/types`)

```svelte
<script lang="ts">
	import type { ViewType } from '$lib/data/types';
	import F2L from './F2L.svelte';
	import OLL from './OLL.svelte';
	import PLL from './PLL.svelte';

	interface Props {
		algorithm: string;
		type: ViewType;
	}

	let { algorithm, type }: Props = $props();
</script>

{#if type === 'F2L'}
	<F2L {algorithm} />
{:else if type === 'OLL'}
	<OLL {algorithm} />
{:else if type === 'PLL'}
	<PLL {algorithm} />
{/if}
```

- [ ] **Step 6: Type-check**

```bash
bun run check
```

Expected: 0 errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(client): port LastLayer, PLL, OLL, F2L, CubeView"
```

---

## Task 8: Algorithm components — `AlgorithmVerifier`, `AlgorithmView`, `AlgorithmsList`

**Files:**
- Create: `apps/client/src/lib/components/AlgorithmVerifier.svelte`
- Create: `apps/client/src/lib/components/AlgorithmView.svelte`
- Create: `apps/client/src/lib/components/AlgorithmsList.svelte`

> Verifier *logic* is already tested (Task 5). Run `svelte-autofixer` on each file.

- [ ] **Step 1: Create `AlgorithmVerifier.svelte`** (uses `isAlgorithmCorrect`; lucide icons; daisyUI `text-success`/`text-error`)

```svelte
<script lang="ts">
	import { CircleAlert, ShieldCheck } from '@lucide/svelte';
	import { isAlgorithmCorrect } from '$lib/cube/isAlgorithmCorrect';
	import type { ViewType } from '$lib/data/types';

	interface Props {
		algorithm: string;
		setup: string;
		onlyError?: boolean;
		viewType: ViewType;
	}

	let { algorithm, setup, onlyError = false, viewType }: Props = $props();

	const isCorrect = $derived(isAlgorithmCorrect(setup, algorithm, viewType));
</script>

{#if isCorrect}
	{#if !onlyError}
		<span title="Algorithm is good" class="text-success"><ShieldCheck class="size-4" /></span>
	{/if}
{:else}
	<span title="Algorithm is bad" class="text-error"><CircleAlert class="size-4" /></span>
{/if}
```

- [ ] **Step 2: Create `AlgorithmView.svelte`** (ported from `AlgorithmView.astro`; `mnemonics` field; HeroUI leftovers → daisyUI `border-base-300`/`text-base-content/*`)

```svelte
<script lang="ts">
	import type { Algorithm, ViewType } from '$lib/data/types';
	import AlgorithmVerifier from './AlgorithmVerifier.svelte';

	interface Props {
		setup: string;
		algorithm: Algorithm;
		isMain?: boolean;
		slim: boolean;
		viewType: ViewType;
	}

	let { setup, algorithm, isMain = false, slim, viewType }: Props = $props();

	const showMnemonic = $derived((!slim || isMain) && algorithm.mnemonics);
	const showDescription = $derived((!slim || isMain) && algorithm.description);
</script>

<div
	class={[
		'flex flex-col justify-center rounded-md border border-base-300',
		{ 'mb-2 border-2': isMain }
	]}
>
	<span
		class={[
			'flex items-center justify-center gap-1 p-1 text-center',
			isMain ? 'text-2xl font-bold' : 'text-xl'
		]}
	>
		{algorithm.rotations}
		<AlgorithmVerifier algorithm={algorithm.rotations} {setup} onlyError={slim} {viewType} />
	</span>
	{#if showMnemonic}
		<span class="text-center text-lg text-base-content/80">{algorithm.mnemonics}</span>
	{/if}
	{#if showDescription}
		<span class="text-center text-base text-base-content/60">{algorithm.description}</span>
	{/if}
</div>
```

- [ ] **Step 3: Create `AlgorithmsList.svelte`** (ported from `AlgorithmsList.astro`; `Badge` → daisyUI `badge`)

```svelte
<script lang="ts">
	import type { Algorithm, ViewType } from '$lib/data/types';
	import AlgorithmView from './AlgorithmView.svelte';

	const otherAlgorithmsLimit = 2;

	interface Props {
		class?: string;
		setup: string;
		algorithms: Algorithm[];
		slim: boolean;
		viewType: ViewType;
	}

	let { class: className = '', setup, algorithms, slim, viewType }: Props = $props();

	const mainAlgorithm = $derived(algorithms[0]);
	const otherAlgorithms = $derived(algorithms.slice(1));
	const limitedOtherAlgorithms = $derived(
		otherAlgorithms.slice(0, slim ? otherAlgorithmsLimit : otherAlgorithms.length)
	);
	const hasMore = $derived(otherAlgorithms.length > limitedOtherAlgorithms.length);
</script>

<div class={[className, 'flex flex-col gap-1']}>
	<AlgorithmView {setup} algorithm={mainAlgorithm} {slim} {viewType} isMain />
	{#each limitedOtherAlgorithms as algorithm (algorithm.id)}
		<AlgorithmView {setup} {algorithm} {slim} {viewType} />
	{/each}
	{#if hasMore}
		<span class="badge badge-outline self-center">
			+{otherAlgorithms.length - limitedOtherAlgorithms.length}
		</span>
	{/if}
</div>
```

- [ ] **Step 4: Type-check and commit**

```bash
bun run check
git add -A
git commit -m "feat(client): port algorithm verifier, view, and list components"
```

Expected: 0 errors.

---

## Task 9: `CaseView` and `CasesList`

**Files:**
- Create: `apps/client/src/lib/components/CaseView.svelte`
- Create: `apps/client/src/lib/components/CasesList.svelte`

> Run `svelte-autofixer` on each.

- [ ] **Step 1: Create `CaseView.svelte`** (ported from `CaseView.astro`; consumes `CaseWithContext`; shadcn `Card`/`Separator` → daisyUI `card`/`divider`; `subset.setId` is now a plain string)

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
</script>

<div id={c.id} class="card @container w-full bg-base-200 p-2">
	<div
		class="card-body grid grid-cols-[8rem_1fr] grid-rows-[auto_1fr_auto] items-center justify-center gap-2 p-2 @lg:grid-cols-[15rem_1fr]"
	>
		<div class="col-start-1 row-span-2 row-start-1">
			<CubeView algorithm={c.setup} type={c.viewType} />
		</div>
		<div
			class="col-span-2 col-start-1 row-start-3 flex flex-col items-center rounded-md border-2 border-base-300 p-2"
		>
			<div>Setup</div>
			<div class="divider my-1"></div>
			<span class="text-center">{c.setup}</span>
		</div>
		<div class="flex items-center justify-center gap-1">
			<span class="text-2xl font-bold">{c.name}</span>
			{#if slim}
				<span class="badge">{c.subset.name}</span>
			{:else}
				<a href={`/${c.subset.setId}/${c.subset.id}#${c.id}`}>
					<span class="badge">{c.subset.name}</span>
				</a>
			{/if}
		</div>
		<AlgorithmsList
			class="self-start"
			viewType={c.viewType}
			setup={c.setup}
			algorithms={c.algorithms}
			{slim}
		/>
	</div>
</div>
```

- [ ] **Step 2: Create `CasesList.svelte`** (ported from `CasesList.astro`; `linkWithBase` → plain root-relative href)

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

<div class="flex flex-col items-center gap-4">
	{#each cases as c (c.id)}
		<a class="w-full" href={`/${c.subset.setId}/${c.subset.id}/${c.id}`}>
			<CaseView case={c} {slim} />
		</a>
	{/each}
	{#if cases.length === 0}
		<div class="text-2xl uppercase">No cases</div>
	{/if}
</div>
```

- [ ] **Step 3: Type-check and commit**

```bash
bun run check
git add -A
git commit -m "feat(client): port CaseView and CasesList"
```

Expected: 0 errors.

---

## Task 10: `Preview` and `PreviewList`

**Files:**
- Create: `apps/client/src/lib/components/Preview.svelte`
- Create: `apps/client/src/lib/components/PreviewList.svelte`

> Run `svelte-autofixer` on each.

- [ ] **Step 1: Create `Preview.svelte`** (ported from `Preview.astro`; shadcn `Card` → daisyUI `card`; active ring kept as `ring-cube-green`)

```svelte
<script lang="ts">
	import type { ViewType } from '$lib/data/types';
	import CubeView from './cube/CubeView.svelte';

	interface Props {
		name: string;
		size: number;
		href: string;
		previewAlgorithm: string;
		viewType: ViewType;
		isActive?: boolean;
	}

	let { name, size, href, previewAlgorithm, viewType, isActive = false }: Props = $props();
</script>

<a {href} class={['rounded-box', { 'ring-2 ring-cube-green': isActive }]}>
	<div class="card bg-base-200">
		<div class="card-body items-center gap-2 p-4">
			<h2 class="card-title text-center">{name}</h2>
			<div class="size-20">
				<CubeView algorithm={previewAlgorithm} type={viewType} />
			</div>
			<span class="badge badge-neutral">{size}</span>
		</div>
	</div>
</a>
```

- [ ] **Step 2: Create `PreviewList.svelte`** (ported from `PreviewList.astro`; active state from `$app/state` page url)

```svelte
<script lang="ts">
	import { page } from '$app/state';
	import type { PreviewItem } from '$lib/data/types';
	import Preview from './Preview.svelte';

	interface Props {
		items: PreviewItem[];
	}

	let { items }: Props = $props();
</script>

<div class="flex flex-wrap gap-1">
	{#each items as item (item.href)}
		<Preview {...item} isActive={item.href === page.url.pathname} />
	{/each}
</div>
```

- [ ] **Step 3: Type-check and commit**

```bash
bun run check
git add -A
git commit -m "feat(client): port Preview and PreviewList"
```

Expected: 0 errors.

---

## Task 11: `Breadcrumbs` and `ThemeToggle`

**Files:**
- Create: `apps/client/src/lib/components/Breadcrumbs.svelte`
- Create: `apps/client/src/lib/components/ThemeToggle.svelte`

> Run `svelte-autofixer` on each.

- [ ] **Step 1: Create `Breadcrumbs.svelte`** (daisyUI `breadcrumbs`; last crumb is plain text, earlier ones are links)

```svelte
<script lang="ts">
	import type { Breadcrumb } from '$lib/data/types';

	interface Props {
		breadcrumbs: Breadcrumb[];
	}

	let { breadcrumbs }: Props = $props();

	const links = $derived(breadcrumbs.slice(0, -1));
	const active = $derived(breadcrumbs.at(-1));
</script>

<div class="breadcrumbs text-sm">
	<ul>
		{#each links as link (link.href)}
			<li><a href={link.href}>{link.name}</a></li>
		{/each}
		{#if active}
			<li>{active.name}</li>
		{/if}
	</ul>
</div>
```

- [ ] **Step 2: Create `ThemeToggle.svelte`** (JS-driven; syncs from the `data-theme` set by the `app.html` inline script; persists to `localStorage`)

```svelte
<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';

	let theme = $state<'light' | 'dark'>('dark');

	$effect(() => {
		const current = document.documentElement.dataset.theme;
		if (current === 'light' || current === 'dark') {
			theme = current;
		}
	});

	const toggle = () => {
		theme = theme === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem('theme', theme);
		} catch {
			// ignore storage errors (e.g. private mode)
		}
	};
</script>

<button class="btn btn-ghost btn-circle" onclick={toggle} aria-label="Toggle theme">
	{#if theme === 'dark'}
		<Sun class="size-5" />
	{:else}
		<Moon class="size-5" />
	{/if}
</button>
```

- [ ] **Step 3: Type-check and commit**

```bash
bun run check
git add -A
git commit -m "feat(client): breadcrumbs and theme toggle components"
```

Expected: 0 errors.

---

## Task 12: `AppSidebar`

**Files:**
- Create: `apps/client/src/lib/layout/AppSidebar.svelte`

> Run `svelte-autofixer`. Filter logic ported verbatim from legacy `AppSidebar.tsx`.

- [ ] **Step 1: Create `AppSidebar.svelte`**

```svelte
<script lang="ts">
	import { GalleryVerticalEnd, Search } from '@lucide/svelte';
	import { page } from '$app/state';
	import type { SidebarSet } from '$lib/data/types';

	interface Props {
		sidebar: SidebarSet[];
	}

	let { sidebar }: Props = $props();

	let query = $state('');

	const filtered = $derived.by(() => {
		const q = query.toLowerCase();
		return sidebar
			.map((set) => ({
				...set,
				subsets: set.subsets
					.map((subset) =>
						subset.name.toLowerCase().includes(q)
							? subset
							: { ...subset, cases: subset.cases.filter((c) => c.name.toLowerCase().includes(q)) }
					)
					.filter((subset) => subset.cases.length > 0)
			}))
			.filter((set) => set.subsets.length > 0);
	});

	const isActive = (href: string) => page.url.pathname === href;
</script>

<aside class="flex min-h-full w-72 flex-col gap-2 bg-base-200 p-4">
	<a href="/" class="flex items-center gap-2 px-2 py-1">
		<span
			class="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-content"
		>
			<GalleryVerticalEnd class="size-4" />
		</span>
		<span class="font-semibold">Algorithms</span>
	</a>

	<label class="input input-sm w-full">
		<Search class="size-4 opacity-50" />
		<input type="search" placeholder="Search for algs" bind:value={query} />
	</label>

	<ul class="menu w-full grow flex-nowrap overflow-y-auto">
		{#each filtered as set (set.id)}
			<li>
				<a href={`/${set.id}`} class="font-semibold">{set.name}</a>
				<ul>
					{#each set.subsets as subset (subset.id)}
						<li>
							<a
								href={`/${set.id}/${subset.id}`}
								class:menu-active={isActive(`/${set.id}/${subset.id}`)}
							>
								{subset.name}
							</a>
							<ul>
								{#each subset.cases as c (c.id)}
									<li>
										<a
											href={`/${set.id}/${subset.id}/${c.id}`}
											class:menu-active={isActive(`/${set.id}/${subset.id}/${c.id}`)}
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
	</ul>
</aside>
```

- [ ] **Step 2: Type-check and commit**

```bash
bun run check
git add -A
git commit -m "feat(client): app sidebar with search filter and nav tree"
```

Expected: 0 errors.

---

## Task 13: Root layout shell (drawer + header) and layout data

**Files:**
- Modify: `apps/client/src/app.d.ts`
- Modify: `apps/client/src/routes/+layout.ts`
- Modify: `apps/client/src/routes/+layout.svelte`

> Run `svelte-autofixer` on `+layout.svelte`.

- [ ] **Step 1: Declare `breadcrumbs` on `App.PageData`**

Replace `apps/client/src/app.d.ts` with:

```ts
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			breadcrumbs?: import('$lib/data/types').Breadcrumb[];
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
```

- [ ] **Step 2: Load the sidebar tree in the root layout**

Replace `apps/client/src/routes/+layout.ts` with:

```ts
import { getSidebarTree } from '$lib/data/repository';
import type { LayoutLoad } from './$types';

export const prerender = true;

export const load: LayoutLoad = () => ({ sidebar: getSidebarTree() });
```

- [ ] **Step 3: Build the drawer shell**

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
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<svelte:head>
	<title>My Cubing Algs</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="drawer lg:drawer-open">
	<input id="app-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex min-h-screen flex-col">
		<header class="navbar border-b border-base-300 bg-base-100">
			<label for="app-drawer" class="btn btn-square btn-ghost lg:hidden" aria-label="Open sidebar">
				<Menu class="size-5" />
			</label>
			<div class="flex-1">
				<Breadcrumbs breadcrumbs={page.data.breadcrumbs ?? []} />
			</div>
			<ThemeToggle />
		</header>
		<main class="flex-1 p-4">
			{@render children()}
		</main>
	</div>
	<div class="drawer-side z-10">
		<label for="app-drawer" class="drawer-overlay" aria-label="Close sidebar"></label>
		<AppSidebar sidebar={data.sidebar} />
	</div>
</div>
```

- [ ] **Step 4: Type-check and commit**

```bash
bun run check
git add -A
git commit -m "feat(client): drawer layout shell with sidebar, breadcrumbs, theme toggle"
```

Expected: 0 errors.

---

## Task 14: Home route `/`

**Files:**
- Create: `apps/client/src/routes/+page.ts`
- Modify: `apps/client/src/routes/+page.svelte` (replaces the Task 1 placeholder)

- [ ] **Step 1: Create the loader** `apps/client/src/routes/+page.ts`

```ts
import { getAllCases, getSetCases, getSets } from '$lib/data/repository';
import { getBreadcrumbs } from '$lib/data/breadcrumbs';
import type { PreviewItem } from '$lib/data/types';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	const sets = getSets();
	const allCases = getAllCases();

	const items: PreviewItem[] = [
		{ href: '/', name: 'All', previewAlgorithm: '', size: allCases.length, viewType: 'PLL' },
		...sets.map((set) => ({
			href: `/${set.id}`,
			name: set.name,
			previewAlgorithm: '',
			size: getSetCases(set.id).length,
			viewType: set.viewType
		}))
	];

	return { items, cases: allCases, breadcrumbs: getBreadcrumbs() };
};
```

- [ ] **Step 2: Create the page** `apps/client/src/routes/+page.svelte`

```svelte
<script lang="ts">
	import CasesList from '$lib/components/CasesList.svelte';
	import PreviewList from '$lib/components/PreviewList.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<PreviewList items={data.items} />
<div class="mt-2 flex flex-col gap-2">
	<CasesList cases={data.cases} slim />
</div>
```

- [ ] **Step 3: Smoke-test in the browser**

```bash
bun run dev
```

Open `http://localhost:5173/`. Confirm:
- The sidebar (left, visible on wide screens) lists **F2L / OLL / PLL**, each expandable to subsets and cases.
- The home page shows preview cards (**All**, F2L, OLL, PLL) each with a **rendered cube** and a count badge, followed by a list of case cards.
- **Check the F2L preview cube specifically renders as a slanted/isometric 3-face shape.** If it looks flat, apply the skew fallback from Task 7 Step 4 (`-skew-x-[45deg]` / `-skew-y-[45deg]`) and reload.
- The theme-toggle button (top-right) switches light/dark and the choice survives a reload.

Stop the dev server when done.

- [ ] **Step 4: Type-check and commit**

```bash
bun run check
git add -A
git commit -m "feat(client): home route with preview grid and case list"
```

---

## Task 15: Set route `/[setId]`

**Files:**
- Create: `apps/client/src/routes/[setId]/+page.ts`
- Create: `apps/client/src/routes/[setId]/+page.svelte`

- [ ] **Step 1: Create the loader** `apps/client/src/routes/[setId]/+page.ts`

```ts
import { error } from '@sveltejs/kit';
import { findSet, getSetCases, getSets, getSetSubsets, getSubsetCases } from '$lib/data/repository';
import { getBreadcrumbs } from '$lib/data/breadcrumbs';
import type { PreviewItem } from '$lib/data/types';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => getSets().map((set) => ({ setId: set.id }));

export const load: PageLoad = ({ params }) => {
	const set = findSet(params.setId);
	if (!set) error(404, 'Set not found');

	const subsets = getSetSubsets(set.id);
	const cases = getSetCases(set.id);

	const items: PreviewItem[] = [
		{
			href: `/${set.id}`,
			name: 'All',
			previewAlgorithm: '',
			size: cases.length,
			viewType: set.viewType
		},
		...subsets.map((subset) => ({
			href: `/${set.id}/${subset.id}`,
			name: subset.name,
			previewAlgorithm: subset.previewAlgorithm,
			size: getSubsetCases(subset.id).length,
			viewType: set.viewType
		}))
	];

	return { items, cases, breadcrumbs: getBreadcrumbs({ set }) };
};
```

- [ ] **Step 2: Create the page** `apps/client/src/routes/[setId]/+page.svelte`

```svelte
<script lang="ts">
	import CasesList from '$lib/components/CasesList.svelte';
	import PreviewList from '$lib/components/PreviewList.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<PreviewList items={data.items} />
<div class="mt-2 flex flex-col gap-2">
	<CasesList cases={data.cases} slim />
</div>
```

- [ ] **Step 3: Type-check and commit**

```bash
bun run check
git add -A
git commit -m "feat(client): set route"
```

Expected: 0 errors. (You can also re-open the dev server and click a set in the sidebar to confirm it loads and the breadcrumb updates.)

---

## Task 16: Subset route `/[setId]/[subsetId]`

**Files:**
- Create: `apps/client/src/routes/[setId]/[subsetId]/+page.ts`
- Create: `apps/client/src/routes/[setId]/[subsetId]/+page.svelte`

- [ ] **Step 1: Create the loader** `apps/client/src/routes/[setId]/[subsetId]/+page.ts`

```ts
import { error } from '@sveltejs/kit';
import {
	findSet,
	findSubset,
	getSetCases,
	getSets,
	getSetSubsets,
	getSubsetCases
} from '$lib/data/repository';
import { getBreadcrumbs } from '$lib/data/breadcrumbs';
import type { PreviewItem } from '$lib/data/types';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () =>
	getSets().flatMap((set) =>
		getSetSubsets(set.id).map((subset) => ({ setId: set.id, subsetId: subset.id }))
	);

export const load: PageLoad = ({ params }) => {
	const set = findSet(params.setId);
	const subset = findSubset(params.subsetId);
	if (!set || !subset) error(404, 'Not found');

	const subsets = getSetSubsets(set.id);
	const cases = getSubsetCases(subset.id);

	const items: PreviewItem[] = [
		{
			href: `/${set.id}`,
			name: 'All',
			previewAlgorithm: '',
			size: getSetCases(set.id).length,
			viewType: set.viewType
		},
		...subsets.map((s) => ({
			href: `/${set.id}/${s.id}`,
			name: s.name,
			previewAlgorithm: s.previewAlgorithm,
			size: getSubsetCases(s.id).length,
			viewType: set.viewType
		}))
	];

	return { items, cases, breadcrumbs: getBreadcrumbs({ set, subset }) };
};
```

- [ ] **Step 2: Create the page** `apps/client/src/routes/[setId]/[subsetId]/+page.svelte`

```svelte
<script lang="ts">
	import CasesList from '$lib/components/CasesList.svelte';
	import PreviewList from '$lib/components/PreviewList.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<PreviewList items={data.items} />
<div class="mt-2 flex flex-col gap-2">
	<CasesList cases={data.cases} slim />
</div>
```

- [ ] **Step 3: Type-check and commit**

```bash
bun run check
git add -A
git commit -m "feat(client): subset route"
```

Expected: 0 errors.

---

## Task 17: Case route `/[setId]/[subsetId]/[caseId]`

**Files:**
- Create: `apps/client/src/routes/[setId]/[subsetId]/[caseId]/+page.ts`
- Create: `apps/client/src/routes/[setId]/[subsetId]/[caseId]/+page.svelte`

- [ ] **Step 1: Create the loader** `apps/client/src/routes/[setId]/[subsetId]/[caseId]/+page.ts`

```ts
import { error } from '@sveltejs/kit';
import { findSet, findSubset, getCase, getSets, getSetSubsets, getSubsetCases } from '$lib/data/repository';
import { getBreadcrumbs } from '$lib/data/breadcrumbs';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () =>
	getSets().flatMap((set) =>
		getSetSubsets(set.id).flatMap((subset) =>
			getSubsetCases(subset.id).map((c) => ({
				setId: set.id,
				subsetId: subset.id,
				caseId: c.id
			}))
		)
	);

export const load: PageLoad = ({ params }) => {
	const set = findSet(params.setId);
	const subset = findSubset(params.subsetId);
	const currentCase = getCase(params.caseId);
	if (!set || !subset || !currentCase) error(404, 'Case not found');

	return {
		case: currentCase,
		breadcrumbs: getBreadcrumbs({ set, subset, case: currentCase })
	};
};
```

- [ ] **Step 2: Create the page** `apps/client/src/routes/[setId]/[subsetId]/[caseId]/+page.svelte`

```svelte
<script lang="ts">
	import CaseView from '$lib/components/CaseView.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<CaseView case={data.case} slim={false} />
```

- [ ] **Step 3: Smoke-test a case page**

```bash
bun run dev
```

Open a case (e.g. `http://localhost:5173/OLL/Oriented-Edges/OLL-21`). Confirm: the full case card shows the cube, the Setup block, the case name + subset badge, and the algorithm list — each algorithm line ending with a green check (correct) or red alert (incorrect) verifier icon. Stop the server.

- [ ] **Step 4: Type-check and commit**

```bash
bun run check
git add -A
git commit -m "feat(client): case detail route"
```

---

## Task 18: Full verification — build, prerender, lint, CI script

**Files:**
- Modify: `apps/client/package.json` (test script)
- Modify: `turbo.json` (repo root — build outputs)

- [ ] **Step 1: Point the `test` script at the node project**

In `apps/client/package.json`, set the `test` script so CI (`bun run test` → turbo) runs the logic tests without launching a browser:

```json
		"test": "vitest run --project server",
```

- [ ] **Step 2: Run the full unit suite**

```bash
bun run test
```

Expected: PASS — the `tables`, `repository`, `breadcrumbs`, and `isAlgorithmCorrect` suites all green.

- [ ] **Step 3: Format, lint, type-check**

```bash
bun run format
bun run lint
bun run check
```

Expected: `lint` and `check` report no errors. Fix any eslint/prettier issues they surface, then re-run until clean.

- [ ] **Step 4: Build and verify the prerendered output**

```bash
bun run build
find build -name index.html | wc -l
test -f build/OLL/Oriented-Edges/OLL-21/index.html && echo "nested case prerendered"
```

Expected: `bun run build` completes with no prerender errors; the `find ... | wc -l` count is **40** (1 home + 3 sets + 7 subsets + 29 cases); the nested-case check prints `nested case prerendered`.

- [ ] **Step 5: Preview the production build**

```bash
bun run preview
```

Open the served URL and re-run the visual checks (sidebar tree + search filter, preview grids, a case page with verifier icons, theme toggle persists). Stop the server.

- [ ] **Step 6: Update turbo build outputs (repo root)**

The root `turbo.json` lists Astro-era build outputs. From the **repo root**, change the `build` task's `outputs` to cover the SvelteKit and package outputs:

```json
		"build": {
			"outputs": ["dist/**", ".svelte-kit/**", "build/**"],
			"dependsOn": ["^build"]
		},
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore(client): node-only test script, turbo build outputs, final verification"
```

---

## Task 19: Update the root `CLAUDE.md`

**Files:**
- Modify: `CLAUDE.md` (repo root)

The root `CLAUDE.md` still describes the Astro/React app. Update it to describe the SvelteKit app.

- [ ] **Step 1: Replace the "Development Commands" section**

Replace the body of `## Development Commands` with:

````markdown
This is a monorepo using Bun workspaces. The main application is in `apps/client/` (SvelteKit). `apps/client-legacy/` is the previous Astro app, kept for reference.

**From `apps/client/`:**
- `bun run dev` - Start the Vite dev server (http://localhost:5173)
- `bun run build` - Build the static site to `./build/` (adapter-static, fully prerendered)
- `bun run preview` - Preview the production build
- `bun run test` - Run Vitest unit tests (node project)
- `bun run check` - Run `svelte-check` for type/syntax errors
- `bun run lint` - Run Prettier check + ESLint
- `bun run format` - Apply Prettier formatting
````

- [ ] **Step 2: Replace the "Architecture Overview" and "Core Structure" sections**

Replace everything from `## Architecture Overview` up to (but not including) the `## Testing` section with:

````markdown
## Architecture Overview

A **Rubik's Cube algorithm learning application** built with:
- **SvelteKit 2** - file-based routing, statically prerendered (`adapter-static`)
- **Svelte 5** - runes-mode components
- **TypeScript** - type safety throughout
- **Tailwind CSS 4 + daisyUI 5** - styling
- **Vitest** - testing framework

### Core Structure

**`packages/cube/`** - framework-agnostic 3D cube simulation engine (reused as-is). See `packages/cube/internals.md`. Key API: `algorithmToFaces`, `applyRotations`, `createCube`, `isCubeSolved`, `rotationsFromString`, `toColoredFaceSlices`, `getAdjacentPieces`, `Colors`, `Faces`.

**`packages/db/`** - Drizzle + SQLite schema (cube → set → subset → case → algorithm). The intended long-term data source; not yet wired into the client.

**`apps/client/src/lib/data/`** - the data layer. `tables/*.json` are normalized, db-mirrored data generated from the legacy JSON by `scripts/transform-legacy-data.ts`. `repository.ts` reads them and assembles UI view-models (`CaseWithContext`, sidebar tree). `types.ts` mirrors `packages/db/schema.ts`. Swapping to the real `db` later is localized to the repository.

**`apps/client/src/lib/components/`** - UI components, incl. `cube/` (the 2D cube visualization: `CubeView`, `Face`, `Piece`, `PLL`, `OLL`, `F2L`, `LastLayer`).

**`apps/client/src/lib/layout/`** - `AppSidebar`.

**`apps/client/src/routes/`** - file-based routes: `/`, `/[setId]`, `/[setId]/[subsetId]`, `/[setId]/[subsetId]/[caseId]`; the root `+layout.svelte` is the daisyUI drawer shell. Each dynamic route exports `entries()` for prerendering.

**Data model:** `cube` is data-only (single `3x3`); navigation is `set → subset → case`. `viewType` (`F2L`/`OLL`/`PLL`) lives on `set` and is inherited. Each algorithm is its own row; a case's `defaultAlgorithmId` is the "main" algorithm.
````

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update root CLAUDE.md for the SvelteKit app"
```

---

## Done

All routes ported, statically prerendered, type-checked, linted, and unit-tested. The data layer is db-shaped behind a repository so wiring the real `packages/db` later stays localized.

**Deferred follow-ups (out of scope, noted in the spec):**
- Seed & wire `packages/db` (fix relations/casing, Bun build-time codegen or direct queries) and re-point the repository at it.
- Update `deploy.yml` (still uses the Astro action pointed at `apps/client`) before the next deploy, and decide whether a base path is needed for the chosen host.





