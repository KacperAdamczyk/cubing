## Design

- The 3x3 cube is divided into 26 pieces.
- Each piece is either a corner or an edge
- Each piece is treated as a 1x1 cube
- Each operation on the cube is a rotation on a piece

## Cube pieces layout

|     |     |      |     |     |     |      |     |     |       |      |     |
| --- | --- | ---- | --- | --- | --- | ---- | --- | --- | ----- | ---- | --- |
|     |     |      | 18  | 19  | 20  |      |     |     |       |      |     |
|     |     |      | 10  | 11  | 12  |      |     |     |       |      |     |
|     |     |      | 1   | 2   | 3   |      |     |     |       |      |     |
|     |     |      |     |     |     |      |     |     |       | <--> |     |
| 18  | 10  | 1 \| | 1   | 2   | 3   | \| 3 | 12  | 20  | \| 18 | 19   | 20  |
| 21  | 13  | 4 \| | 4   | 5   | 6   | \| 6 | 14  | 23  | \| 21 | 22   | 23  |
| 24  | 15  | 7 \| | 7   | 8   | 9   | \| 9 | 17  | 26  | \| 24 | 25   | 26  |
|     |     |      |     |     |     |      |     |     |       |      |     |
|     |     |      | 7   | 8   | 9   |      |     |     |       |      |     |
|     |     |      | 15  | 16  | 17  |      |     |     |       |      |     |
|     |     |      | 24  | 25  | 26  |      |     |     |       |      |     |

## Cube

- cube state
- color orientation
- history?

## Cube State

- Edges
- Corners

### Piece

- Face Scheme

## Face Scheme

Face scheme is an representation of all 6 faces of a piece in relation to the cube faces

## Colors

- R
- G
- B
- O
- W
- Y

## Rotations

- x, x', x2
- y, y', y2
- z, z', z2

## Internal Operators

### Pieces

- rotatePiece(Rotation, Piece): Piece
- isPieceFacing(Face, Piece): boolean
- isPieceValid(Piece): boolean
- getPieceType(Piece): PieceType | undefined
- getPieceId(Piece): string
- colorPiece(ColorOrientation, Piece): ColorScheme

### Cube

- executeOperation(FundamentalOperation, Cube): Cube
- executeOperations(FundamentalOperation[], Cube): Cube

## Public Operators

### Cube - Cube

- U, U', U2, U2', u, u'
- R, R', R2, R2', r, r'
- L...
- F...
- B...
- D...
- M, M', M2, M2'
- S...
- E...
- x, x', x2
- y, y', y2
- z, z', z2

### Cube - any

- toColoredFaces(Cube): Faces
- validate(Cube): boolean

### any - Cube

- createCube(stringOrOperators?): Cube
- setColorOrientation(ColorOrientation, Cube): Cube
- fromFaces(Faces, Cube): Cube
- move(Operators[], Cube): Cube

### Helpers

- operatorsFromString(string): Operators[]
- execute(...)
