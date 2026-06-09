import { expect, test } from "bun:test";
import { getPieceId } from "@/cube/internal/getPieceId";
import { mockStickers } from "@/cube/test/mockStickers";
import { Face } from "@/cube/types/Face";

test("returns the piece id", () => {
	const id = getPieceId(
		mockStickers({
			U: Face.R,
			R: Face.U,
			B: Face.F,
		}),
	);

	expect(id).toEqual({
		U: true,
		R: true,
		B: true,
	});
});
