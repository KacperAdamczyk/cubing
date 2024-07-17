import { applyRotations } from "@/compound/applyRotations";
import { toColoredFaceSlices } from "@/compound/toColoredFaceSlices";
import { rotationsFromString } from "@/helpers/rotationsFromString";
import { createCube } from "@/initializers/createCube";
import type { ColorOrientation } from "@/types/ColorOrientation";
import type { Colors } from "@/types/Colors";
import type { FaceSlices } from "@/types/FaceSlices";

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
