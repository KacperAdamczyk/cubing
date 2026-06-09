# Cube engine internals

A framework-agnostic 3x3 Rubik's Cube simulation. Every operation is a pure,
immutable transformation; nothing here touches the DOM or any framework.

## Design

- The cube is modelled as the 26 visible pieces (the hidden core is omitted):
  8 corners, 12 edges, 6 centers.
- Each piece is treated as its own 1x1 cube. A piece's **stickers** record,
  for each of the six directions (U/D/F/B/L/R), which original face currently
  points that way — or `undefined` where the piece has no sticker.
- Every move is expressed as a rotation of the affected pieces' stickers, so
  the cube state is just the collection of pieces and their stickers.

## Piece layout

`CubeState` is a 26-tuple laid out top layer, then middle layer, then bottom
layer (9 + 8 + 9). Pieces are not identified by index but by the faces they
occupy — `getPieceId` derives that set from a piece's stickers, and
`stringifyPieceId` turns it into a stable key (e.g. `FRU`). The authoritative
construction of the solved cube lives in `factories/createCubeState`.

`toFaceGrids` maps those pieces onto the six 3x3 face grids via the
`facesToIdsMap` table; `toColoredFaceGrids` then colors them for a given
orientation.

## Core types

- `Cube` — `{ orientation, state }`.
- `CubeState` — the 26-piece tuple (`CornerPiece` / `EdgePiece` / `CenterPiece`).
- `Piece` — `{ type, stickers }`.
- `Stickers<Value = Face>` — `Record<Face, Value | undefined>`.
- `Color` — the six colors (R, G, B, O, W, Y).
- `Face` — the six faces (U, D, F, B, L, R).
- `Move` — full notation (U, U', U2, u, M, E, S, x, y, z, ...).
  `FundamentalMove` — the quarter-turn primitives every `Move` decomposes into.
- `FaceGrid<V>` / `FaceGrids<V>` — one face's 3x3 grid / all six grids.
  `Triple<V>` is the shared `[V, V, V]` row.
- `ColorOrientation` — the cube's orientation (the U and F colors).
  `FaceColors` — the resolved color of all six faces for an orientation.
- `AdjacentPieces<V>` (+ `Side`) — the ring of stickers around a face.

## Public API

Exported from the package root (`index.ts`):

- `createCube(options?)` — build a solved cube (optionally oriented).
- `movesFromString(algorithm)` — parse notation into `Move[]`.
- `applyMoves(moves, cube)` — apply moves to a cube.
- `algorithmToFaces({ algorithm, orientation })` — parse + apply + color in one
  call; the path used for rendering.
- `toColoredFaceGrids(cube)` — the six faces as color grids.
- `getAdjacentPieces(grids, upFace)` — the ring of stickers around a face.
- `isCubeSolved(cube)`.
- Types/enums: `Color`, `Face`, `Cube`, `FaceGrid`, `FaceGrids`,
  `ColorOrientation`, `AdjacentPieces`, `Side`.

## Internal operators

- `rotatePiece(move, piece)` / `rotateCube(move, cube)` — the primitives;
  `applyFundamentalMoves` / the `moveFns` table compose them into full moves.
- `permuteStickers(swaps, stickers)` — apply face swaps to a piece's stickers.
- `getMoveScope(move)` — which piece types and faces a fundamental move affects.
- `getPieceId(stickers)` / `stringifyPieceId(id)` — identify a piece by the
  faces it occupies.
- `toFaceGrids(cube)` — the six faces as `Face` grids (before coloring).
- `expandColors(orientation)` — `ColorOrientation` → `FaceColors`.
- `faceEntries(record)` — `Object.entries` typed by `Face`.
