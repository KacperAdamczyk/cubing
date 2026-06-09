import type { Stickers } from "@/cube/types/Stickers";

export enum PieceType {
	CORNER = "CORNER",
	EDGE = "EDGE",
	CENTER = "CENTER",
}

export interface Piece {
	type: PieceType;
	stickers: Stickers;
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
