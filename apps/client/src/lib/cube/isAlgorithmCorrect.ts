import { applyMoves, createCube, isCubeSolved, movesFromString, toColoredFaceGrids } from 'cube';
import type { ViewType } from '$lib/data/types';

/**
 * Applies `setup` then `algorithm` to a solved cube and reports whether the
 * result counts as solved for the given view type. PLL requires a fully solved
 * cube; OLL/F2L only require a uniform (correctly oriented) top face.
 */
export const isAlgorithmCorrect = (
	setup: string,
	algorithm: string,
	viewType: ViewType
): boolean => {
	const operations = movesFromString(`${setup} ${algorithm}`);
	const scrambled = applyMoves(operations, createCube());

	if (viewType === 'PLL') {
		return isCubeSolved(scrambled);
	}

	const faces = toColoredFaceGrids(scrambled);
	return new Set(faces.U.flat()).size === 1;
};
