import type { Cube } from "@/types/Cube";
import type { Rotations } from "@/types/Rotations";
import { rotations } from "@/compound/rotations";

export const applyRotations = (rotationsList: Rotations[], cube: Cube): Cube =>
  rotationsList.reduce(
    (currentCube, rotation) => rotations[rotation](currentCube),
    cube,
  );
