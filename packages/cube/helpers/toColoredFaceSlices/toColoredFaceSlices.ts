import { expandColors } from "@/helpers/expandColors";
import { toFaceSlices } from "@/internal/toFaceSlices";
import type { ColorOrientation } from "@/types/ColorOrientation";
import type { Colors } from "@/types/Colors";
import type { Cube } from "@/types/Cube";
import type { FaceSlice } from "@/types/FaceSlice";
import type { FaceSlices } from "@/types/FaceSlices";
import type { Faces } from "@/types/Faces";

export const toColoredFaceSlices = (
  orientation: ColorOrientation,
  cube: Cube
): FaceSlices<Colors> => {
  const slices = toFaceSlices(cube);
  const colorScheme = expandColors(orientation);

  return Object.fromEntries(
    (Object.entries(slices) as [Faces, FaceSlice<Faces>][]).map(
      ([face, slice]) => {
        const coloredSlice = slice.map((row) =>
          row.map((value) => colorScheme[value])
        );

        return [face, coloredSlice] as const;
      }
    )
  ) as FaceSlices<Colors>;
};
