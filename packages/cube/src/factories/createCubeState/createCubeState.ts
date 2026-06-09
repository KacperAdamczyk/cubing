import { createStickers } from "@/cube/factories/createStickers";
import type { CubeState } from "@/cube/types/CubeState";
import { PieceType } from "@/cube/types/Piece";

export const createCubeState = (): CubeState => [
	// Top layer
	{
		type: PieceType.CORNER,
		stickers: createStickers({
			U: true,
			L: true,
			B: true,
		}),
	},
	{
		type: PieceType.EDGE,
		stickers: createStickers({
			U: true,
			B: true,
		}),
	},
	{
		type: PieceType.CORNER,
		stickers: createStickers({
			U: true,
			R: true,
			B: true,
		}),
	},
	{
		type: PieceType.EDGE,
		stickers: createStickers({
			U: true,
			L: true,
		}),
	},
	{
		type: PieceType.CENTER,
		stickers: createStickers({
			U: true,
		}),
	},
	{
		type: PieceType.EDGE,
		stickers: createStickers({
			U: true,
			R: true,
		}),
	},
	{
		type: PieceType.CORNER,
		stickers: createStickers({
			U: true,
			L: true,
			F: true,
		}),
	},
	{
		type: PieceType.EDGE,
		stickers: createStickers({
			U: true,
			F: true,
		}),
	},
	{
		type: PieceType.CORNER,
		stickers: createStickers({
			U: true,
			R: true,
			F: true,
		}),
	},
	// Middle layer
	{
		type: PieceType.EDGE,
		stickers: createStickers({
			L: true,
			B: true,
		}),
	},
	{
		type: PieceType.CENTER,
		stickers: createStickers({
			B: true,
		}),
	},
	{
		type: PieceType.EDGE,
		stickers: createStickers({
			B: true,
			R: true,
		}),
	},
	{
		type: PieceType.CENTER,
		stickers: createStickers({
			L: true,
		}),
	},
	{
		type: PieceType.CENTER,
		stickers: createStickers({
			R: true,
		}),
	},
	{
		type: PieceType.EDGE,
		stickers: createStickers({
			F: true,
			L: true,
		}),
	},
	{
		type: PieceType.CENTER,
		stickers: createStickers({
			F: true,
		}),
	},
	{
		type: PieceType.EDGE,
		stickers: createStickers({
			F: true,
			R: true,
		}),
	},
	// Bottom layer
	{
		type: PieceType.CORNER,
		stickers: createStickers({
			D: true,
			L: true,
			B: true,
		}),
	},
	{
		type: PieceType.EDGE,
		stickers: createStickers({
			D: true,
			B: true,
		}),
	},
	{
		type: PieceType.CORNER,
		stickers: createStickers({
			D: true,
			R: true,
			B: true,
		}),
	},
	{
		type: PieceType.EDGE,
		stickers: createStickers({
			D: true,
			L: true,
		}),
	},
	{
		type: PieceType.CENTER,
		stickers: createStickers({
			D: true,
		}),
	},
	{
		type: PieceType.EDGE,
		stickers: createStickers({
			D: true,
			R: true,
		}),
	},
	{
		type: PieceType.CORNER,
		stickers: createStickers({
			D: true,
			L: true,
			F: true,
		}),
	},
	{
		type: PieceType.EDGE,
		stickers: createStickers({
			D: true,
			F: true,
		}),
	},
	{
		type: PieceType.CORNER,
		stickers: createStickers({
			D: true,
			R: true,
			F: true,
		}),
	},
];
