import { expandColors } from "@/cube/helpers/expandColors";
import type { ColorOrientation } from "@/cube/types/ColorOrientation";
import type { Color } from "@/cube/types/Color";
import type { Face } from "@/cube/types/Face";
import type { ColoredPiece, Piece } from "@/cube/types/Piece";
import type { Stickers } from "@/cube/types/Stickers";

export const colorPiece = (
	orientation: ColorOrientation,
	piece: Piece,
): ColoredPiece => {
	const expandedColors = expandColors(orientation);

	const coloredStickers = Object.fromEntries(
		(Object.entries(piece.stickers) as [Face, Face | undefined][]).map(
			([face, orientedFace]) => {
				if (orientedFace === undefined) {
					return [face, undefined] as const;
				}

				return [face, expandedColors[orientedFace]] as const;
			},
		),
	) as Stickers<Color>;

	return {
		...piece,
		stickers: coloredStickers,
	};
};
