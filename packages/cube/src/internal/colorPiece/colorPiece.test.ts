import { expect, test } from "bun:test";
import { colorPiece } from "@/cube/internal/colorPiece";
import { mockPieceScheme } from "@/cube/test/mockPieceScheme";
import { Colors } from "@/cube/types/Colors";
import { Faces } from "@/cube/types/Faces";
import { PieceType } from "@/cube/types/Piece";

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
