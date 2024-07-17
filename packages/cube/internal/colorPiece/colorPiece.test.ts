import { colorPiece } from "@/internal/colorPiece";
import { mockPieceScheme } from "@/test/mockPieceScheme";
import { Colors } from "@/types/Colors";
import { Faces } from "@/types/Faces";
import { PieceType } from "@/types/Piece";
import { expect, test } from "vitest";

test("colors a piece", () => {
	const coloredPiece = colorPiece(
		{ U: Colors.W, F: Colors.G },
		{
			type: PieceType.CORNER,
			scheme: mockPieceScheme({
				U: Faces.L,
				R: Faces.U,
				B: Faces.B,
			}),
		},
	);

	expect(coloredPiece.scheme).toEqual({
		U: Colors.O,
		R: Colors.W,
		B: Colors.B,
		D: undefined,
		F: undefined,
		L: undefined,
	});
});
