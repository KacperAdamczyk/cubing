import { expect, test } from "bun:test";
import { colorPiece } from "@/cube/internal/colorPiece";
import { mockStickers } from "@/cube/test/mockStickers";
import { Color } from "@/cube/types/Color";
import { Face } from "@/cube/types/Face";
import { PieceType } from "@/cube/types/Piece";

test("colors a piece", () => {
	const coloredPiece = colorPiece(
		{ U: Color.W, F: Color.G },
		{
			type: PieceType.CORNER,
			stickers: mockStickers({
				U: Face.L,
				R: Face.U,
				B: Face.B,
			}),
		},
	);

	expect(coloredPiece.stickers).toEqual({
		U: Color.O,
		R: Color.W,
		B: Color.B,
		D: undefined,
		F: undefined,
		L: undefined,
	});
});
