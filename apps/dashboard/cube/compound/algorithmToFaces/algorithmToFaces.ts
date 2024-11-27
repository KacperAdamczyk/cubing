import { applyRotations } from "@/cube/compound/applyRotations";
import { toColoredFaceSlices } from "@/cube/compound/toColoredFaceSlices";
import { rotationsFromString } from "@/cube/helpers/rotationsFromString";
import { createCube } from "@/cube/initializers/createCube";
import type { ColorOrientation } from "@/cube/types/ColorOrientation";
import type { Colors } from "@/cube/types/Colors";
import type { FaceSlices } from "@/cube/types/FaceSlices";

export interface AlgorithmToFacesParams {
  algorithm: string;
  orientation: ColorOrientation;
}

export const algorithmToFaces = ({
  algorithm,
  orientation,
}: AlgorithmToFacesParams): FaceSlices<Colors> => {
  const cube = createCube({
    orientation,
  });
  const rotations = rotationsFromString(algorithm);
  const scrambledCube = applyRotations(rotations, cube);

  return toColoredFaceSlices(scrambledCube);
};
