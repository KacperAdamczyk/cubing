import { rotations } from "@/cube/compound/rotations";
import type { Cube } from "@/cube/types/Cube";
import type { Rotations } from "@/cube/types/Rotations";

export const applyRotations = (rotationList: Rotations[], cube: Cube): Cube =>
	rotationList.reduce(
		(currentCube, rotation) => rotations[rotation](currentCube),
		cube,
	);
