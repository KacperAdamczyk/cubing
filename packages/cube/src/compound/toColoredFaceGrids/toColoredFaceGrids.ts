import { expandColors } from "@/cube/helpers/expandColors";
import { toFaceGrids } from "@/cube/internal/toFaceGrids";
import type { Color } from "@/cube/types/Color";
import type { Cube } from "@/cube/types/Cube";
import type { FaceGrid } from "@/cube/types/FaceGrid";
import type { FaceGrids } from "@/cube/types/FaceGrids";
import type { Face } from "@/cube/types/Face";

export const toColoredFaceGrids = (cube: Cube): FaceGrids<Color> => {
	const slices = toFaceGrids(cube);
	const colorScheme = expandColors(cube.orientation);

	return Object.fromEntries(
		(Object.entries(slices) as [Face, FaceGrid<Face>][]).map(
			([face, slice]) => {
				const coloredSlice = slice.map((row) =>
					row.map((value) => colorScheme[value]),
				);

				return [face, coloredSlice] as const;
			},
		),
	) as FaceGrids<Color>;
};
