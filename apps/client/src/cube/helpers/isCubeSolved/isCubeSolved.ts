import { toFaceSlices } from "@/cube/internal/toFaceSlices";
import type { Cube } from "@/cube/types/Cube";

export const isCubeSolved = (cube: Cube): boolean => {
  const faces = toFaceSlices(cube);

  const hasAllFacesUnified = Object.values(faces).every(
    (face) => new Set(face.flat()).size === 1,
  );
  const hasAllColors = new Set(Object.values(faces).flat(2)).size === 6;

  return hasAllFacesUnified && hasAllColors;
};
