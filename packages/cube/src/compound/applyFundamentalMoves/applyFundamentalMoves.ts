import { rotateCube } from "@/cube/internal/rotateCube";
import type { Cube } from "@/cube/types/Cube";
import type { FundamentalMove } from "@/cube/types/Move";

export const applyFundamentalMoves = (
	moves: FundamentalMove[],
	cube: Cube,
): Cube =>
	moves.reduce((currentCube, move) => rotateCube(move, currentCube), cube);
