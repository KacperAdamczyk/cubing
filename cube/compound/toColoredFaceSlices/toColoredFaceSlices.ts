import { expandColors } from "@/cube/helpers/expandColors";
import { toFaceSlices } from "@/cube/internal/toFaceSlices";
import type { Colors } from "@/cube/types/Colors";
import type { Cube } from "@/cube/types/Cube";
import type { FaceSlice } from "@/cube/types/FaceSlice";
import type { FaceSlices } from "@/cube/types/FaceSlices";
import type { Faces } from "@/cube/types/Faces";

export const toColoredFaceSlices = (cube: Cube): FaceSlices<Colors> => {
  const slices = toFaceSlices(cube);
  const colorScheme = expandColors(cube.orientation);

  return Object.fromEntries(
    (Object.entries(slices) as [Faces, FaceSlice<Faces>][]).map(
      ([face, slice]) => {
        const coloredSlice = slice.map((row) =>
          row.map((value) => colorScheme[value]),
        );

        return [face, coloredSlice] as const;
      },
    ),
  ) as FaceSlices<Colors>;
};
