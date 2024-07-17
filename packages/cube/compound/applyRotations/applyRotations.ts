import { rotations } from "@/compound/rotations";
import type { Cube } from "@/types/Cube";
import type { Rotations } from "@/types/Rotations";

export const applyRotations = (rotationList: Rotations[], cube: Cube): Cube =>
	rotationList.reduce(
		(currentCube, rotation) => rotations[rotation](currentCube),
		cube,
	);
