# cubing

A Rubik's Cube algorithm learning app: browse F2L, OLL and PLL cases with a 2D cube
visualization of each one, and drill a chosen selection of cases in the trainer.

Live at **https://cubing.admck.com**.

Built with SvelteKit 2 (Svelte 5 runes), TypeScript, Tailwind CSS 4 + daisyUI 5, Drizzle +
SQLite for the algorithm data, and deployed to Cloudflare Workers.

## Repository layout

This is a [Bun](https://bun.sh) workspaces monorepo orchestrated with [Turborepo](https://turborepo.com).

```text
apps/
  client/        SvelteKit app (routes, UI components, data layer, trainer)
packages/
  cube/          Framework-agnostic cube simulation engine (moves, faces, solved checks)
  db/            Drizzle schema + committed db.sqlite, the source of truth for algorithm data
```

- **`apps/client`** renders `cube → set → subset → case` pages. Everything except the trainer
  is prerendered at build time: catalog data is read from `db` through prerendered remote
  functions and inlined into the static output, so no database code runs in the browser or
  Worker. The trainer (`/train`, `/train/session`) is rendered dynamically on the Worker and
  keeps its state in the URL.
- **`packages/cube`** is the engine behind the visualizations (`createCube`, `applyMoves`,
  `algorithmToFaces`, `isCubeSolved`, …). See `packages/cube/src/internals.md`.
- **`packages/db`** holds the schema (`schema.ts`), migrations (`drizzle/`) and the data
  itself (`db.sqlite`), opened read-only via `bun:sqlite`.

More architectural detail lives in [`AGENTS.md`](./AGENTS.md).

## Getting started

Requires Bun (the version is pinned in `packageManager` in `package.json`). The app runs on
the Bun runtime rather than Node, because `packages/db` uses `bun:sqlite` at build time.

```sh
bun install
cd apps/client
bun run dev
```

The dev server runs through [portless](https://github.com/vercel-labs/portless) at
`https://cubing.localhost` (`:1355` if the proxy runs unprivileged). Git worktrees get their
own `<branch>.cubing.localhost` route.

## Commands

From the repo root:

| Command             | What it does                                                   |
| :------------------ | :------------------------------------------------------------- |
| `bun run build`     | Build every workspace (turbo)                                  |
| `bun run test`      | Run every workspace's tests (turbo)                            |
| `bun run typecheck` | `svelte-check` / `tsc` across workspaces (turbo)               |
| `bun run lint`      | `biome check .`, the same check CI runs                        |
| `bun run format`    | `biome check --write .` (format, sort imports, safe lint fixes) |

From `apps/client`:

| Command           | What it does                                                    |
| :---------------- | :-------------------------------------------------------------- |
| `bun run dev`     | Vite dev server via portless                                    |
| `bun run build`   | Production build to `.svelte-kit/cloudflare/`                   |
| `bun run preview` | Preview the production build                                    |
| `bun run test`    | Vitest unit tests (run once)                                    |
| `bun run test:unit` | Vitest in watch mode                                          |
| `bun run check`   | `svelte-check` type check                                       |
| `bun run deploy`  | `wrangler deploy` to Cloudflare Workers                         |

Cube engine tests live in `packages/cube`; run them there with `bun test`.

## Editing algorithm data

Algorithm data lives in `packages/db/db.sqlite`. Edit it with Drizzle Studio
(`bun run --filter db drizzle:studio`) or SQL, commit the updated `db.sqlite`, and run
`bun run --filter db build` before building the client so it picks up the latest data.

## Testing

Tests use Vitest and sit next to the code they cover (`*.test.ts`). CI (`.github/workflows/pr.yml`)
runs tests, lint, typecheck and build on every pull request.

## Deployment

Pushes to `main` deploy automatically via `.github/workflows/deploy.yml`, which builds and runs
`wrangler deploy` in the GitHub `production` environment (secrets `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID`). Worker config is in `apps/client/wrangler.jsonc`.

To deploy by hand:

```sh
cd apps/client
bun run build
bun run deploy
```

To run the built Worker locally (after a build), from `apps/client`:

```sh
bunx wrangler dev --port 8788 --local-upstream localhost:8788 --upstream-protocol http
```

The `--local-upstream` flags matter: without them wrangler simulates the custom-domain route
and the prerendered remote functions fetch their data from the live site instead of the local
build.
