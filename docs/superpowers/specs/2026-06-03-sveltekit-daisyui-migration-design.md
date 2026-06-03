# SvelteKit + daisyUI migration of the cubing app

**Date:** 2026-06-03
**Status:** Approved design
**Topic:** Migrate `apps/client-legacy` (Astro 5 + React 19 + shadcn/ui) to `apps/client` (SvelteKit 2 + Svelte 5 + Tailwind 4 + daisyUI 5)

## Context & goal

`apps/client-legacy` is a Rubik's Cube algorithm reference app: browse algorithm **sets** (F2L / OLL / PLL) → **subsets** → **cases**. Each case shows a 2D cube visualization, a setup scramble, and a list of algorithms, each with a solver-based "is this algorithm correct" verifier.

`apps/client` is a fresh SvelteKit scaffold (Svelte 5 runes, Tailwind 4, daisyUI 5, Vitest browser+node, Playwright, a Svelte-docs MCP). It currently holds only demo/scaffold files; daisyUI is in `package.json` but not yet wired into CSS.

Goal: reproduce the legacy app in `apps/client` using daisyUI components. Keep the **overall layout** (sidebar + header + content, preview-card grids, case views, cube visualizations). Not a pixel-perfect port — adopt daisyUI idioms and recommended patterns.

The `packages/cube` engine (pure, framework-agnostic TypeScript) is reused **unchanged**.

## Locked decisions

1. **Command palette: dropped.** The legacy ⌘K `cmdk` palette (`Commander.tsx`) is not ported. The sidebar search filter is the only search. The header's right slot becomes a **light/dark theme toggle**.
2. **Theme: daisyUI light + dark with a toggle**, defaulting to dark. Cube face colors preserved exactly via custom tokens (not theme-driven).
3. **Rendering: `adapter-static` + full prerender. No base path. `deploy.yml` untouched.** The app is host-agnostic static output; deployment target is deferred ("something different, later").

## Architecture

### Stack & rendering
- SvelteKit 2, Svelte 5 (runes mode — already forced in `svelte.config.js`), Tailwind 4, daisyUI 5.
- `@sveltejs/adapter-static` replaces `adapter-auto`.
- `export const prerender = true` in the root `+layout.ts` (inherited by all routes).
- Dynamic routes export `entries()` to enumerate params (mirrors the legacy `getStaticPaths`).
- No `paths.base`; links are plain root-relative. `linkWithBase` is **not** ported.

### Data layer
- Move `sets.json`, `subsets.json`, `cases.json` into `src/lib/data/`. (`algorithms.json` is unused — not migrated.)
- Replace the `astro:content` + zod schema with plain TypeScript types in `src/lib/data/types.ts`:
  - `ViewType = 'PLL' | 'OLL' | 'F2L'`
  - `Algorithm = { rotations: string; rotationsMnemonic: string | null; description: string | null }`
  - `Set = { id; name; viewType }`
  - `Subset = { id; name; previewAlgorithm; viewType; setId }`
  - `Case = { id; name; setup; viewType; subsetId; algorithms: Algorithm[] }`
- Synchronous query helpers in `src/lib/data/` (data is bundled, no async needed) mirroring the legacy queries:
  - `getSets()`
  - `getSetSubsets(setId)`
  - `getSubsetCases(subsetId)` → cases joined with their `subset`
  - `getSetCases(setId)` → all cases in a set
  - `getAllCases()` → all cases joined with their `set`
  - `getSidebarTree()` → nested `sets → subsets → cases` for the sidebar (mirrors the computation in legacy `Layout.astro`)
- Relationships are resolved in TS (`case.subsetId → subset`, `subset.setId → set`); the legacy `reference()` indirection is dropped.

### Routing & prerender
Same hierarchy as legacy, each route gets a `+page.ts` (`load` + `entries` where dynamic) and a `+page.svelte`:

| Route | Content | `entries()` |
|---|---|---|
| `/` | PreviewList (All + sets) + CasesList of all cases (slim) | — |
| `/[setId]` | PreviewList (All + subsets) + CasesList of set cases (slim) | all set ids |
| `/[setId]/[subsetId]` | PreviewList (All + sibling subsets) + CasesList of subset cases (slim) | all (setId, subsetId) |
| `/[setId]/[subsetId]/[caseId]` | Full CaseView (non-slim) | all (setId, subsetId, caseId) |

Each `load` also returns `breadcrumbs` (via a `getBreadcrumbs` helper ported from legacy). The layout reads `page.data.breadcrumbs`.

### Layout shell + theme
- `src/routes/+layout.svelte` — daisyUI `drawer`:
  - `drawer-side` = `AppSidebar` (open on `lg+` via `lg:drawer-open`, toggled via a checkbox on mobile).
  - `drawer-content` = header + page content.
  - Header: drawer toggle (`label for` the drawer checkbox, hidden on `lg+`), daisyUI `breadcrumbs`, and a theme toggle pinned right.
- `+layout.ts` — `prerender = true`; `load` returns the sidebar tree (`getSidebarTree()`) so the sidebar renders on every page.
- **Theme toggle:** daisyUI `theme-controller` (a checkbox whose value sets `data-theme`). Persistence + no-FOUC via a tiny inline script in `app.html` that reads `localStorage.theme` (default `dark`) and sets `data-theme` on `<html>` before paint. The toggle writes back to `localStorage`.
- daisyUI themes configured in app CSS: `@plugin "daisyui" { themes: light, dark --prefersdark; }` (exact theme names finalized during implementation; dark is the default).

### Sidebar (`src/lib/layout/AppSidebar.svelte`)
- Logo row (links to `/`).
- Search `input` bound to a `$state` query.
- daisyUI `menu` rendering the filtered tree: per set a group label (links to `/[setId]`), subset items (link, active when `page.url.pathname` matches), nested case items (link, active state).
- Filter logic ported verbatim from legacy `AppSidebar.tsx`: keep a subset if its name matches the query, else keep only its matching cases; drop empty subsets and empty sets.

### Component mapping (Astro/React → Svelte + daisyUI)
All under `src/lib/components/`:
- `Preview.svelte` / `PreviewList.svelte` → daisyUI `card` + count `badge` in a flex-wrap grid; active card gets a ring (cube-green or primary).
- `CaseView.svelte` → daisyUI `card` with the same CSS grid (cube view + setup block + name/subset `badge` + algorithms); `divider` replaces the shadcn `Separator`. `slim` prop controls density.
- `CasesList.svelte` → vertical list of `CaseView` wrapped in links; "No cases" empty state.
- `AlgorithmsList.svelte` / `AlgorithmView.svelte` → same main-algorithm + limited-others (2 in slim) + "+N" `badge` structure.
- `AlgorithmVerifier.svelte` → same cube-engine solve check (`rotationsFromString` → `applyRotations` → `isCubeSolved` for PLL, else top-layer-uniform via `toColoredFaceSlices`), rendered with daisyUI `text-success` / `text-error` and `@lucide/svelte` icons.
- `Breadcrumbs` → daisyUI `breadcrumbs` (rendered in the layout header from `page.data.breadcrumbs`).

### Cube visualization (`src/lib/components/cube/`)
Near-verbatim Svelte ports — logic is presentational (call engine, render grid):
- `CubeView.svelte` — dispatches by `type` to `F2L` / `OLL` / `PLL`.
- `Piece.svelte` — colored div; `Colors` enum → `bg-cube-*` via Svelte `class:` directives; `blankColor = 'X'`.
- `Face.svelte` — 3×3 grid of `Piece` with optional adjacent pieces, masking, optional face label; `{#if}` blocks replace the Astro conditionals.
- `LastLayer.svelte` — `algorithmToFaces` + `getAdjacentPieces`, renders U face with adjacency.
- `PLL.svelte` — `LastLayer` with no masking.
- `OLL.svelte` — `LastLayer` masking all colors except yellow.
- `F2L.svelte` — 3-face isometric (U/F/R) with skew transforms, masking Y/B/O.

### Styling / theme tokens
- App CSS (`src/routes/layout.css` or a renamed `app.css`) gets `@import "tailwindcss";` + `@plugin "daisyui" {...}` + the custom `@theme` block moved from the legacy `global.css`:
  - `--color-cube-green|red|blue|orange|white|yellow|blank`
  - `--grid-template-columns-cube`, `--grid-template-columns-cube-flat`, `--grid-template-rows-cube`, `--grid-template-rows-cube-flat`
- The legacy shadcn CSS variables (`--background`, `--sidebar-*`, etc.) are **not** carried over — daisyUI semantic colors (`base-100/200/300`, `base-content`, `primary`, etc.) replace them.
- Dangling HeroUI leftover classes in legacy components (`text-default-400/500/600`, `border-divider`, `text-medium`) are swapped for daisyUI equivalents (`text-base-content/60`, `border-base-300`, etc.).
- The isometric skew classes (`-skew-x-45`, `-skew-y-45`, `scale-125`, `origin-bottom-left`) are preserved as-is; verified visually against the dev server.

### Cleanup & dependencies
- Remove scaffold files: `routes/demo/**`, the welcome `routes/+page.svelte`, `lib/vitest-examples/**`, the placeholder `lib/index.ts`.
- Remove the stray `apps/client/pnpm-lock.yaml` (repo standardizes on bun); normalize `npm run` references in `package.json` scripts to bun where it matters.
- Add dependencies: `cube` (`workspace:*`), `@lucide/svelte`. (`daisyui` already present.)
- Update the root `CLAUDE.md` (currently describes the Astro app) to reflect the SvelteKit stack, commands, and structure.

### Testing
- Unit tests (Vitest, node project) for pure logic: the data query helpers and the `AlgorithmVerifier` solve-detection.
- `svelte-check` must pass; a dev-server smoke check (via the `run`/`verify` skills) confirms the visual components and cube rendering.
- Not pursuing exhaustive component tests — proportional to a visual port.

## Out of scope
- Command palette (⌘K).
- `deploy.yml` / CI changes and the `/cubing` base path. **Heads-up:** `deploy.yml` still uses `withastro/action` pointed at `apps/client`, so it must be updated before the next deploy — tracked separately.
- The unused `algorithms.json`.
- Any change to `packages/cube`.

## Reused as-is: `packages/cube` API
`algorithmToFaces`, `applyRotations`, `toColoredFaceSlices`, `getAdjacentPieces`, `isCubeSolved`, `rotationsFromString`, `createCube`, `Colors`, `Faces`, and the types (`AdjacentPieces`, `ColorOrientation`, `Cube`, `FaceSlice`, `FaceSlices`).
