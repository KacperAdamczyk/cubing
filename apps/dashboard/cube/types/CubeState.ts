import type { CenterPiece, CornerPiece, EdgePiece } from "@/cube/types/Piece";

export type CubeState = [
  // Top layer
  CornerPiece,
  EdgePiece,
  CornerPiece,
  EdgePiece,
  CenterPiece,
  EdgePiece,
  CornerPiece,
  EdgePiece,
  CornerPiece,
  // Middle layer
  EdgePiece,
  CenterPiece,
  EdgePiece,
  CenterPiece,
  CenterPiece,
  EdgePiece,
  CenterPiece,
  EdgePiece,
  // Bottom layer
  CornerPiece,
  EdgePiece,
  CornerPiece,
  EdgePiece,
  CenterPiece,
  EdgePiece,
  CornerPiece,
  EdgePiece,
  CornerPiece,
];
