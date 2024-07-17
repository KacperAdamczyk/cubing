import { createPieceScheme } from "@/initializers/createPieceScheme";
import type { CubeState } from "@/types/CubeState";
import { PieceType } from "@/types/Piece";

export const createCubeState = (): CubeState => [
	// Top layer
	{
		type: PieceType.CORNER,
		scheme: createPieceScheme({
			U: true,
			L: true,
			B: true,
		}),
	},
	{
		type: PieceType.EDGE,
		scheme: createPieceScheme({
			U: true,
			B: true,
		}),
	},
	{
		type: PieceType.CORNER,
		scheme: createPieceScheme({
			U: true,
			R: true,
			B: true,
		}),
	},
	{
		type: PieceType.EDGE,
		scheme: createPieceScheme({
			U: true,
			L: true,
		}),
	},
	{
		type: PieceType.CENTER,
		scheme: createPieceScheme({
			U: true,
		}),
	},
	{
		type: PieceType.EDGE,
		scheme: createPieceScheme({
			U: true,
			R: true,
		}),
	},
	{
		type: PieceType.CORNER,
		scheme: createPieceScheme({
			U: true,
			L: true,
			F: true,
		}),
	},
	{
		type: PieceType.EDGE,
		scheme: createPieceScheme({
			U: true,
			F: true,
		}),
	},
	{
		type: PieceType.CORNER,
		scheme: createPieceScheme({
			U: true,
			R: true,
			F: true,
		}),
	},
	// Middle layer
	{
		type: PieceType.EDGE,
		scheme: createPieceScheme({
			L: true,
			B: true,
		}),
	},
	{
		type: PieceType.CENTER,
		scheme: createPieceScheme({
			B: true,
		}),
	},
	{
		type: PieceType.EDGE,
		scheme: createPieceScheme({
			B: true,
			R: true,
		}),
	},
	{
		type: PieceType.CENTER,
		scheme: createPieceScheme({
			L: true,
		}),
	},
	{
		type: PieceType.CENTER,
		scheme: createPieceScheme({
			R: true,
		}),
	},
	{
		type: PieceType.EDGE,
		scheme: createPieceScheme({
			F: true,
			L: true,
		}),
	},
	{
		type: PieceType.CENTER,
		scheme: createPieceScheme({
			F: true,
		}),
	},
	{
		type: PieceType.EDGE,
		scheme: createPieceScheme({
			F: true,
			R: true,
		}),
	},
	// Bottom layer
	{
		type: PieceType.CORNER,
		scheme: createPieceScheme({
			D: true,
			L: true,
			B: true,
		}),
	},
	{
		type: PieceType.EDGE,
		scheme: createPieceScheme({
			D: true,
			B: true,
		}),
	},
	{
		type: PieceType.CORNER,
		scheme: createPieceScheme({
			D: true,
			R: true,
			B: true,
		}),
	},
	{
		type: PieceType.EDGE,
		scheme: createPieceScheme({
			D: true,
			L: true,
		}),
	},
	{
		type: PieceType.CENTER,
		scheme: createPieceScheme({
			D: true,
		}),
	},
	{
		type: PieceType.EDGE,
		scheme: createPieceScheme({
			D: true,
			R: true,
		}),
	},
	{
		type: PieceType.CORNER,
		scheme: createPieceScheme({
			D: true,
			L: true,
			F: true,
		}),
	},
	{
		type: PieceType.EDGE,
		scheme: createPieceScheme({
			D: true,
			F: true,
		}),
	},
	{
		type: PieceType.CORNER,
		scheme: createPieceScheme({
			D: true,
			R: true,
			F: true,
		}),
	},
];
