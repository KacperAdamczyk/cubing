import type { Colors } from "@/types/Colors";
import { PieceScheme } from "@/types/PieceScheme";

export enum PieceType {
  CORNER = "CORNER",
  EDGE = "EDGE",
  CENTER = "CENTER",
}

export interface Piece {
  type: PieceType;
  scheme: PieceScheme;
}

export interface ColoredPiece {
  type: PieceType;
  scheme: PieceScheme<Colors>;
}

export interface CornerPiece extends Piece {
  type: PieceType.CORNER;
}

export interface EdgePiece extends Piece {
  type: PieceType.EDGE;
}

export interface CenterPiece extends Piece {
  type: PieceType.CENTER;
}
