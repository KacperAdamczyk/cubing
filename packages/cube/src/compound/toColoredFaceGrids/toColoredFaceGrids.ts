import { expandColors } from "@/cube/helpers/expandColors";
import { faceEntries } from "@/cube/helpers/faceEntries";
import { toFaceGrids } from "@/cube/internal/toFaceGrids";
import type { Color } from "@/cube/types/Color";
import type { Cube } from "@/cube/types/Cube";
import type { FaceGrids } from "@/cube/types/FaceGrids";

export const toColoredFaceGrids = (cube: Cube): FaceGrids<Color> => {
	const grids = toFaceGrids(cube);
	const colorScheme = expandColors(cube.orientation);

	return Object.fromEntries(
		faceEntries(grids).map(([face, grid]) => {
			const coloredGrid = grid.map((row) =>
				row.map((value) => colorScheme[value]),
			);

			return [face, coloredGrid] as const;
		}),
	) as FaceGrids<Color>;
};
