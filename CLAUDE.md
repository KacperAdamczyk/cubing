# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a monorepo using Bun workspaces. The main application is in `apps/client/`.

**From the root directory:**
- `cd apps/client` - Navigate to the main application
- Use Bun as the package manager: `bun install`, `bun run <script>`

**From `apps/client/`:**
- `bun run dev` - Start development server at localhost:4321
- `bun run build` - Build production site to ./dist/
- `bun run preview` - Preview production build
- `bun run test` - Run Vitest tests
- `bun run test:ui` - Run Vitest with UI
- `bun run lint` - Run ESLint
- `bun run format:check` - Check Prettier formatting
- `bun run format:write` - Apply Prettier formatting
- `bun run check` - Run Astro check for type/syntax errors

## Architecture Overview

This is a **Rubik's Cube algorithm learning application** built with:
- **Astro** - Static site generator with React components
- **React 19** - UI components and interactivity
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Styling with shadcn/ui components
- **Vitest** - Testing framework

### Core Structure

**`src/cube/`** - Custom 3D cube simulation engine:
- **Types**: Comprehensive type definitions for cube state, rotations, colors, faces
- **Initializers**: Functions to create cube instances and states
- **Internal**: Low-level cube operations (piece rotation, face manipulation)
- **Compound**: High-level operations combining multiple internal functions
- **Helpers**: Utility functions for cube analysis and manipulation

**Key Cube Concepts:**
- 26-piece cube model (corners and edges)
- Each piece treated as 1x1 cube with rotations
- Face schemes represent piece orientations
- Algorithm notation (R, U, F, etc.) parsed to rotations

**`src/data/`** - JSON datasets:
- `algorithms.json` - Cubing algorithms with rotations
- `cases.json` - Algorithm cases and scenarios  
- `sets.json` - Algorithm categories (PLL, OLL, F2L, etc.)
- `subsets.json` - Subcategories within sets

**`src/components/`** - React/Astro components:
- **Cube visualization** components (CubeView, Face, Piece)
- **Algorithm displays** (AlgorithmView, AlgorithmsList)
- **UI components** using shadcn/ui patterns

**`src/pages/`** - Astro file-based routing:
- Dynamic routes: `[setId]/[subsetId]/[caseId].astro`
- Hierarchical navigation through algorithm sets

### Key Files

- `src/cube/index.ts` - Main cube engine API exports
- `src/cube/internals.md` - Detailed cube engine documentation
- `src/queries/` - Data fetching functions for algorithms and cases
- `src/layouts/` - App shell with sidebar navigation

## Testing

- Tests use Vitest and are co-located with source files (`.test.ts`)
- Run `bun run test` for all tests or `bun run test:ui` for interactive mode
- Cube engine has comprehensive unit tests for core operations

## Code Patterns

- **Astro components** for static content, **React components** for interactivity
- **Barrel exports** from `index.ts` files for clean imports
- **Type-first development** with comprehensive TypeScript definitions
- **Functional programming** patterns in cube operations (immutable transformations)