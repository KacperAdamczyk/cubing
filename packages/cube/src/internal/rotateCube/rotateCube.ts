import { getPieceDescriptorForRotation } from "@/cube/helpers/getPieceDescriptorForRotation/getPieceDescriptorForRotation";
import { rotatePiece } from "@/cube/internal/rotatePiece";
import type { Cube } from "@/cube/types/Cube";
import type { Faces } from "@/cube/types/Faces";
import { FundamentalRotations } from "@/cube/types/Rotations";
import { produce } from "immer";

export const rotateCube = (rotation: FundamentalRotations, cube: Cube): Cube =>
	produce(cube, (cubeDraft) => {
		for (const piece of cubeDraft.state) {
			const {
				types,
				includeFaces,
				skipFaces = [],
			} = getPieceDescriptorForRotation(rotation);

			const pieceFaces = Object.entries(piece.scheme) as [
				Faces,
				Faces | undefined,
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

			piece.scheme = rotatePiece(rotation, piece).scheme;
		}
	});
