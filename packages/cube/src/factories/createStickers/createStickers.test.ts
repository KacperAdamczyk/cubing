import { expect, test } from "bun:test";
import { createStickers } from "@/cube/factories/createStickers";
import { Face } from "@/cube/types/Face";

test("creates a piece stickers", () => {
	const stickers = createStickers({
		U: true,
		F: true,
		L: true,
	});

	expect(stickers).toEqual({
		U: Face.U,
		F: Face.F,
		L: Face.L,
		R: undefined,
		D: undefined,
		B: undefined,
	});
});
