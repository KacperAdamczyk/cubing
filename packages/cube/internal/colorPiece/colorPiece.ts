import { expandColors } from "@/helpers/expandColors";
import type { ColorOrientation } from "@/types/ColorOrientation";
import type { Colors } from "@/types/Colors";
import type { Faces } from "@/types/Faces";
import type { ColoredPiece, Piece } from "@/types/Piece";
import type { PieceScheme } from "@/types/PieceScheme";

export const colorPiece = (
	orientation: ColorOrientation,
	piece: Piece,
): ColoredPiece => {
	const expandedColors = expandColors(orientation);

	const coloredPieceScheme = Object.fromEntries(
		(Object.entries(piece.scheme) as [Faces, Faces | undefined][]).map(
			([face, orientedFace]) => {
				if (orientedFace === undefined) {
					return [face, undefined] as const;
				}

				return [face, expandedColors[orientedFace]] as const;
			},
		),
	) as PieceScheme<Colors>;

	return {
		...piece,
		scheme: coloredPieceScheme,
	};
};
