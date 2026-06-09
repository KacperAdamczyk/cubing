import { applyMoves } from "@/cube/compound/applyMoves";
import { toColoredFaceGrids } from "@/cube/compound/toColoredFaceGrids";
import { movesFromString } from "@/cube/helpers/movesFromString";
import { createCube } from "@/cube/factories/createCube";
import type { ColorOrientation } from "@/cube/types/ColorOrientation";
import type { Color } from "@/cube/types/Color";
import type { FaceGrids } from "@/cube/types/FaceGrids";

export interface AlgorithmToFacesParams {
	algorithm: string;
	orientation: ColorOrientation;
}

export const algorithmToFaces = ({
	algorithm,
	orientation,
}: AlgorithmToFacesParams): FaceGrids<Color> => {
	const cube = createCube({
		orientation,
	});
	const moves = movesFromString(algorithm);
	const scrambledCube = applyMoves(moves, cube);

	return toColoredFaceGrids(scrambledCube);
};
