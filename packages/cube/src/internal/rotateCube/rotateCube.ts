import { produce } from "immer";
import { getMoveScope } from "@/cube/helpers/getMoveScope/getMoveScope";
import { rotatePiece } from "@/cube/internal/rotatePiece";
import type { Cube } from "@/cube/types/Cube";
import type { Face } from "@/cube/types/Face";
import type { FundamentalMove } from "@/cube/types/Move";

export const rotateCube = (move: FundamentalMove, cube: Cube): Cube => {
	const { types, includeFaces, skipFaces = [] } = getMoveScope(move);

	return produce(cube, (cubeDraft) => {
		for (const piece of cubeDraft.state) {
			const pieceFaces = Object.entries(piece.stickers) as [
				Face,
				Face | undefined,
			][];

			const hasMatchingFace = pieceFaces.some(
				([face, value]) => value && includeFaces.includes(face),
			);
			const hasSkippedFaces = pieceFaces.some(
				([face, value]) => value && skipFaces.includes(face),
			);
			const hasMatchingType = types.includes(piece.type);

			if (!hasMatchingFace || hasSkippedFaces || !hasMatchingType) {
				continue;
			}

			piece.stickers = rotatePiece(move, piece).stickers;
		}
	});
};
