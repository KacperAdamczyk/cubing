import type { Cube } from "@/types/Cube";
import type { Rotations } from "@/types/Rotations";
import { rotations } from "@/compound/rotations";

export const applyRotations = (rotationList: Rotations[], cube: Cube): Cube =>
  rotationList.reduce(
    (currentCube, rotation) => rotations[rotation](currentCube),
    cube,
  );
