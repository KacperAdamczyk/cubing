import { expect, test } from "bun:test";
import { toColoredFaceGrids } from "@/cube/compound/toColoredFaceGrids";
import { createCube } from "@/cube/factories/createCube";
import { mockStickers } from "@/cube/test/mockStickers";
import { Color } from "@/cube/types/Color";
import type { FaceGrids } from "@/cube/types/FaceGrids";
import { Face } from "@/cube/types/Face";

test("returns colored faces", () => {
	const faces = toColoredFaceGrids(
		createCube({
			orientation: { U: Color.W, F: Color.G },
		}),
	);

	expect(faces).toEqual({
		U: [
			[Color.W, Color.W, Color.W],
			[Color.W, Color.W, Color.W],
			[Color.W, Color.W, Color.W],
		],
		F: [
			[Color.G, Color.G, Color.G],
			[Color.G, Color.G, Color.G],
			[Color.G, Color.G, Color.G],
		],
		R: [
			[Color.R, Color.R, Color.R],
			[Color.R, Color.R, Color.R],
			[Color.R, Color.R, Color.R],
		],
		D: [
			[Color.Y, Color.Y, Color.Y],
			[Color.Y, Color.Y, Color.Y],
			[Color.Y, Color.Y, Color.Y],
		],
		B: [
			[Color.B, Color.B, Color.B],
			[Color.B, Color.B, Color.B],
			[Color.B, Color.B, Color.B],
		],
		L: [
			[Color.O, Color.O, Color.O],
			[Color.O, Color.O, Color.O],
			[Color.O, Color.O, Color.O],
		],
	} satisfies FaceGrids<Color>);
});

test("returns colored faces for a cube with two pieces swapped", () => {
	const cube = createCube({
		orientation: { U: Color.W, F: Color.G },
	});

	cube.state[0].stickers = mockStickers({
		B: Face.B,
		R: Face.U,
		U: Face.L,
	});
	cube.state[2].stickers = mockStickers({
		B: Face.B,
		U: Face.R,
		L: Face.U,
	});

	const faces = toColoredFaceGrids(cube);

	expect(faces).toEqual({
		U: [
			[Color.R, Color.W, Color.O],
			[Color.W, Color.W, Color.W],
			[Color.W, Color.W, Color.W],
		],
		F: [
			[Color.G, Color.G, Color.G],
			[Color.G, Color.G, Color.G],
			[Color.G, Color.G, Color.G],
		],
		R: [
			[Color.R, Color.R, Color.W],
			[Color.R, Color.R, Color.R],
			[Color.R, Color.R, Color.R],
		],
		D: [
			[Color.Y, Color.Y, Color.Y],
			[Color.Y, Color.Y, Color.Y],
			[Color.Y, Color.Y, Color.Y],
		],
		B: [
			[Color.B, Color.B, Color.B],
			[Color.B, Color.B, Color.B],
			[Color.B, Color.B, Color.B],
		],
		L: [
			[Color.W, Color.O, Color.O],
			[Color.O, Color.O, Color.O],
			[Color.O, Color.O, Color.O],
		],
	} satisfies FaceGrids<Color>);
});
