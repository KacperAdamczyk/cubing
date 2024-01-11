import { rotateCube } from "@/internal/rotateCube";
import type { Cube } from "@/types/Cube";
import type { FundamentalRotations } from "@/types/Rotations";

export const applyFundamentalRotations = (
  rotations: FundamentalRotations[],
  cube: Cube,
): Cube =>
  rotations.reduce(
    (currentCube, rotation) => rotateCube(rotation, currentCube),
    cube,
  );
