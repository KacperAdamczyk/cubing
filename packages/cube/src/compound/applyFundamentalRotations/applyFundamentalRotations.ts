import { rotateCube } from "@/cube/internal/rotateCube";
import type { Cube } from "@/cube/types/Cube";
import type { FundamentalRotations } from "@/cube/types/Rotations";

export const applyFundamentalRotations = (
	rotations: FundamentalRotations[],
	cube: Cube,
): Cube =>
	rotations.reduce(
		(currentCube, rotation) => rotateCube(rotation, currentCube),
		cube,
	);
