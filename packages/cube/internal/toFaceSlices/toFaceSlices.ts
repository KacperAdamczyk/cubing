import { pieceIds } from "@/helpers/pieceIds";
import { stringifyPieceId } from "@/helpers/stringifyPieceId/stringifyPieceId";
import { getPieceId } from "@/internal/getPieceId";
import type { Cube } from "@/types/Cube";
import type { FaceSlice } from "@/types/FaceSlice";
import type { FaceSlices } from "@/types/FaceSlices";
import type { Faces } from "@/types/Faces";
import type { Piece } from "@/types/Piece";
import type { PieceId } from "@/types/PieceId";

const facesToIdsMap = {
	U: [
		[pieceIds.BLU, pieceIds.BU, pieceIds.BRU],
		[pieceIds.LU, pieceIds.U, pieceIds.RU],
		[pieceIds.FLU, pieceIds.FU, pieceIds.FRU],
	],
	D: [
		[pieceIds.DFL, pieceIds.DF, pieceIds.DFR],
		[pieceIds.DL, pieceIds.D, pieceIds.DR],
		[pieceIds.BDL, pieceIds.BD, pieceIds.BDR],
	],
	F: [
		[pieceIds.FLU, pieceIds.FU, pieceIds.FRU],
		[pieceIds.FL, pieceIds.F, pieceIds.FR],
		[pieceIds.DFL, pieceIds.DF, pieceIds.DFR],
	],
	B: [
		[pieceIds.BRU, pieceIds.BU, pieceIds.BLU],
		[pieceIds.BR, pieceIds.B, pieceIds.BL],
		[pieceIds.BDR, pieceIds.BD, pieceIds.BDL],
	],
	L: [
		[pieceIds.BLU, pieceIds.LU, pieceIds.FLU],
		[pieceIds.BL, pieceIds.L, pieceIds.FL],
		[pieceIds.BDL, pieceIds.DL, pieceIds.DFL],
	],
	R: [
		[pieceIds.FRU, pieceIds.RU, pieceIds.BRU],
		[pieceIds.FR, pieceIds.R, pieceIds.BR],
		[pieceIds.DFR, pieceIds.DR, pieceIds.BDR],
	],
} satisfies FaceSlices<PieceId>;

export const toFaceSlices = ({ state }: Cube): FaceSlices<Faces> => {
	const piecesMap = new Map<string, Piece>(
		state.map((piece) => [stringifyPieceId(getPieceId(piece.scheme)), piece]),
	);

	return Object.fromEntries(
		(Object.entries(facesToIdsMap) as [Faces, FaceSlice<PieceId>][]).map(
			([face, faceScheme]) => [
				face,
				faceScheme.map((row) =>
					row.map((pieceId) => {
						const piece = piecesMap.get(stringifyPieceId(pieceId));

						if (!piece) {
							throw new Error(
								`Piece ${JSON.stringify(pieceId)} for face ${face} not found`,
							);
						}

						const facesAtPlace = piece.scheme[face];

						if (!facesAtPlace) {
							throw new Error(
								`Piece ${JSON.stringify(pieceId)} has no face ${face}`,
							);
						}

						return facesAtPlace;
					}),
				),
			],
		),
	) as FaceSlices<Faces>;
};
