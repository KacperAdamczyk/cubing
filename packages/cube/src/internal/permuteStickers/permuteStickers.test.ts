import { expect, test } from "bun:test";
import { permuteStickers } from "@/cube/internal/permuteStickers";
import { mockStickers } from "@/cube/test/mockStickers";
import { Face } from "@/cube/types/Face";

test("moves to an empty slot", () => {
	const stickers = permuteStickers(
		[[Face.U, Face.R]],
		mockStickers({
			U: Face.U,
			L: Face.L,
			B: Face.B,
		}),
	);

	expect(stickers).toEqual(
		mockStickers({
			R: Face.U,
			L: Face.L,
			B: Face.B,
		}),
	);
});

test("swaps to a non-empty slot", () => {
	const stickers = permuteStickers(
		[[Face.U, Face.L]],
		mockStickers({
			U: Face.U,
			L: Face.L,
			B: Face.B,
		}),
	);

	expect(stickers).toEqual(
		mockStickers({
			L: Face.U,
			B: Face.B,
		}),
	);
});

test("swaps items", () => {
	const stickers = permuteStickers(
		[
			[Face.U, Face.L],
			[Face.L, Face.U],
		],
		mockStickers({
			U: Face.U,
			L: Face.L,
			B: Face.B,
		}),
	);

	expect(stickers).toEqual(
		mockStickers({
			U: Face.L,
			L: Face.U,
			B: Face.B,
		}),
	);
});
