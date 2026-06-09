import { moveFns } from "@/cube/compound/moves";
import type { Cube } from "@/cube/types/Cube";
import type { Move } from "@/cube/types/Move";

export const applyMoves = (moves: Move[], cube: Cube): Cube =>
	moves.reduce((currentCube, move) => moveFns[move](currentCube), cube);
