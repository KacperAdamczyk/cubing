# UI Cleanup — "Playful Cube" Design

**Date:** 2026-06-04
**Status:** Approved (visual direction signed off via brainstorming companion)
**Scope:** Visual refresh of the SvelteKit client (`apps/client`). Surfaces only — no new features, no data-model changes, no changes to the cube-rendering internals or the cube engine.

## Goal

Make the Rubik's-cube algorithm trainer look prettier and more cohesive. The current UI is functional but flat and monotone: nearly everything is the same `bg-base-200` card on a slightly darker background, with heavy nested borders, weak hierarchy, and no depth, hover states, or color identity.

The approved direction is **"Playful Cube"**: lean into the toy. A type-based color system, the cube as the hero of each card, clearer typography hierarchy, real elevation, and subtle motion — kept tasteful/refined, not loud.

## Decisions (locked during brainstorming)

1. **Both themes.** Keep the existing light + dark toggle; apply the new look to both. Dark stays the default.
2. **Color-code by algorithm type.** Each `viewType` gets a signature color used consistently across the sidebar, the type chips, and the case cards:
   - **F2L → green**, **OLL → gold**, **PLL → blue**, **"All" (home only) → cube gradient**.
   - The actual cube *stickers* keep their true cube colors. The *UI chrome* uses contrast-tuned cousins of those colors so text/borders stay legible on both white and dark backgrounds.
3. **Refined, not loud.** Energy comes from the accent bars, colored pills, the gradient logo mark, and a subtle hover lift — not from gradient titles or strong tints. (User approved this balance.)
4. **Surfaces only.** Restyle the sidebar, top bar, chips, case cards, algorithm blocks, breadcrumbs, and theme toggle across every page. Leave `lib/components/cube/*` (the 2D cube grid) and the `packages/cube` engine untouched.

The approved mockups live at `.superpowers/brainstorm/<session>/content/playful-refined.html` (git-ignored).

## Visual language / tokens

All new tokens live in `apps/client/src/routes/layout.css`. The existing cube-color tokens and grid templates there stay as-is (the cube components depend on them).

### Type accent colors

Defined as theme-scoped CSS custom properties. Starting values from the approved mockup — **each must be re-verified for WCAG AA against the surface it sits on during implementation** (gold and blue are the risky ones):

| Type | Light accent | Dark accent | Pill text |
| --- | --- | --- | --- |
| F2L (green) | `#16a34a` | `#1cb35a` | white (darken to `#15803d` if white-on-green fails AA) |
| OLL (gold) | `#e0a200` | `#ffce3a` | near-black `#1a1400` |
| PLL (blue) | `#2f6dff` | `#5b8bff` | white |
| All (home) | cube gradient `linear-gradient(90deg,#009b48,#ffd500,#ff5900)` | same | n/a |

Implementation pattern — a `data-type` attribute drives a local CSS variable so we avoid a per-color class explosion and keep components DRY:

```css
/* in layout.css, theme-scoped for the contrast-tuned values */
@theme {
  --color-type-f2l: #16a34a;
  --color-type-oll: #e0a200;
  --color-type-pll: #2f6dff;
}
[data-theme='dark'] {
  --color-type-f2l: #1cb35a;
  --color-type-oll: #ffce3a;
  --color-type-pll: #5b8bff;
}
/* map a type onto a single local accent var consumed by components */
[data-type='F2L'] { --type-accent: var(--color-type-f2l); --type-accent-content: #fff; }
[data-type='OLL'] { --type-accent: var(--color-type-oll); --type-accent-content: #1a1400; }
[data-type='PLL'] { --type-accent: var(--color-type-pll); --type-accent-content: #fff; }
```

> Note: name the variable `--type-accent` (NOT `--accent`) to avoid colliding with daisyUI's own semantic tokens. Components set `data-type={viewType}` on their root and consume `var(--type-accent)` (e.g. `bg-(--type-accent)`, `border-(--type-accent)`, or small scoped CSS). The home **"All"** chip uses the gradient via a dedicated class, not `--type-accent`.

### Surfaces, elevation, radius

Tune the daisyUI `light` and `dark` themes (via daisyUI 5 theme config — **use the `daisyui` skill for the exact `@plugin "daisyui/theme"` syntax**) toward the mockup's calmer, slightly indigo-tinted palette. Target values (verify in the live preview; daisyUI uses `base-200/300` internally for inputs/hover, so check those components after):

- **Elevation rule:** page background = `bg-base-200`; raised surfaces (cards, sidebar, navbar) = `bg-base-100` + `border-base-300` + a soft shadow. Choose values so **base-100 reads as lighter/raised above base-200 in both themes**.
  - Light: `base-100 #ffffff`, `base-200 #f2f4f7`, `base-300 #e3e7ee`, `base-content #1b2230`.
  - Dark: `base-100 #20202e`, `base-200 #15151f`, `base-300 #2e2e42`, `base-content #f2f3f8`.
- **Radius:** bump daisyUI `--radius-box` / `--radius-field` toward the friendlier `~14–16px` / `~9px` used in the mockup.
- **Type tint:** case cards get a faint wash of their type color via `color-mix(in srgb, var(--type-accent) 6%, var(--color-base-100))`.
- **Motion:** interactive cards (chips, case cards) get `transition` + a small hover lift (`translateY(-2px)` + slightly stronger shadow). Subtle only.

### Typography hierarchy (per card)

Cube (hero) · **bold case name** · colored **type pill** · main **algorithm** in a monospace chip with the ✓ verifier dot inline · optional muted-italic **mnemonic** · quiet **"Setup · … / +N algs"** footer. This replaces the current stack of equally-weighted bordered boxes.

## Per-component changes

Files under `apps/client/src/`. Each keeps its current props/behavior unless noted.

| File | Change |
| --- | --- |
| `routes/layout.css` | Add type-accent tokens + `[data-type=…]` rules; customize daisyUI light/dark base surfaces + radius (via daisyui skill). Keep existing cube tokens/grids. |
| `routes/+layout.svelte` | Page bg `bg-base-200`; navbar/header on `bg-base-100` with `border-base-300`; comfortable `main` padding; optional content max-width on very wide screens. Drawer/mobile behavior unchanged. |
| `lib/layout/AppSidebar.svelte` | Gradient cube **logo mark**; refined search input; set headers get a **type-colored dot** (`data-type={set.viewType}`); active subset/case gets a **type-colored left bar + tint** (replacing the default `menu-active`); hover states. `SidebarSet` already carries `viewType`. |
| `lib/components/Preview.svelte` | Chip: **type-colored top edge**, active → **ring in `--type-accent`** (replace the hardcoded `ring-cube-green`), count badge, hover lift. Render gradient/neutral when the new `all` flag is set. |
| `lib/components/PreviewList.svelte` | Spacing/wrap polish only. |
| `lib/data/types.ts` | Add `all?: boolean` to `PreviewItem` (explicit "all-types" marker for the neutral gradient chip). |
| `routes/+page.ts` | Set `all: true` on the root **"All"** item only. (Stops the gradient chip from inheriting the misleading hardcoded `viewType: 'PLL'`.) |
| `lib/components/CaseView.svelte` | Rebuild the card: root `data-type={c.viewType}`; **left accent bar** + faint **type tint**; cube as hero (CubeView untouched, just its rounded container/size); header = bold name + **type pill**; **demote Setup** from the big bordered box to a quiet footer line; drop heavy nested borders. Preserve `id={c.id}` (deep-link anchor) and the `slim` vs full behavior. |
| `lib/components/CasesList.svelte` | Hover affordance on the link wrapper; spacing; restyle the empty "No cases" state. Keep `<a>`-wraps-`<CaseView slim>`. |
| `lib/components/AlgorithmsList.svelte` | Emphasize the main algorithm, lighten the others; restyle the "+N" pill. Keep the limit logic. |
| `lib/components/AlgorithmView.svelte` | Algorithm in a **monospace chip** (subtle border, rounded) with the verifier inline; main larger; mnemonic muted-italic; description smaller/muted. Reduce the `border-2`. |
| `lib/components/AlgorithmVerifier.svelte` | Keep correct/incorrect semantics + accessible titles; align colors with `success`/`error` tokens. Minor. |
| `lib/components/Breadcrumbs.svelte` | Refine type/separators/hover. Minor. |
| `lib/components/ThemeToggle.svelte` | Keep logic; restyle the button to match. Minor. |

## Constraints

- **No nested `<a>`.** Slim case cards are wrapped in an `<a>` by `CasesList`; keep their internals anchor-free (subset shows as a span, not a link, when `slim`). The full (detail) card is not wrapped, so inner links are fine there.
- **No new runtime dependencies.** Pure Tailwind 4 / daisyUI 5 / CSS. `@lucide/svelte` is already available for icons.
- **Preserve prerendering.** No changes to `entries()` or load logic beyond the `all` flag.
- **Both themes first-class.** Verify contrast (AA) for accents and text in light *and* dark — especially gold and blue.
- **Don't touch** `lib/components/cube/*`, `packages/cube`, the `lib/data/tables/*.json` data, or routing.

## Out of scope / non-goals

New features or pages; cube-rendering changes; data/schema changes; search/keyboard-nav behavior changes; wiring the real `packages/db`.

## Success criteria

- All four route levels (`/`, `/[setId]`, `/[setId]/[subsetId]`, `/[setId]/[subsetId]/[caseId]`) match the approved mockup's look in **both** themes, with the type-color system applied consistently.
- Mobile drawer (sidebar) still opens/closes and the layout is responsive.
- `bun run check` (svelte-check), `bun run lint` (prettier + eslint), and `bun run test` all pass.
- No nested-anchor or focus-visibility regressions.
- Verified visually via the preview tool: screenshots of each route level, both themes, plus a mobile width.
