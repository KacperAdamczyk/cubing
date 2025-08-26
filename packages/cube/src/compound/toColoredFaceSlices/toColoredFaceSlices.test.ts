import { toColoredFaceSlices } from "@/cube/compound/toColoredFaceSlices";
import { createCube } from "@/cube/initializers/createCube";
import { mockPieceScheme } from "@/cube/test/mockPieceScheme";
import { Colors } from "@/cube/types/Colors";
import type { FaceSlices } from "@/cube/types/FaceSlices";
import { Faces } from "@/cube/types/Faces";
import { expect, test } from "vitest";

test("returns colored faces", () => {
	const faces = toColoredFaceSlices(
		createCube({
			orientation: { U: Colors.W, F: Colors.G },
		}),
	);

	expect(faces).toEqual({
		U: [
			[Colors.W, Colors.W, Colors.W],
			[Colors.W, Colors.W, Colors.W],
			[Colors.W, Colors.W, Colors.W],
		],
		F: [
			[Colors.G, Colors.G, Colors.G],
			[Colors.G, Colors.G, Colors.G],
			[Colors.G, Colors.G, Colors.G],
		],
		R: [
			[Colors.R, Colors.R, Colors.R],
			[Colors.R, Colors.R, Colors.R],
			[Colors.R, Colors.R, Colors.R],
		],
		D: [
			[Colors.Y, Colors.Y, Colors.Y],
			[Colors.Y, Colors.Y, Colors.Y],
			[Colors.Y, Colors.Y, Colors.Y],
		],
		B: [
			[Colors.B, Colors.B, Colors.B],
			[Colors.B, Colors.B, Colors.B],
			[Colors.B, Colors.B, Colors.B],
		],
		L: [
			[Colors.O, Colors.O, Colors.O],
			[Colors.O, Colors.O, Colors.O],
			[Colors.O, Colors.O, Colors.O],
		],
	} satisfies FaceSlices<Colors>);
});

test("returns colored faces for a cube with two pieces swapped", () => {
	const cube = createCube({
		orientation: { U: Colors.W, F: Colors.G },
	});

	cube.state[0].scheme = mockPieceScheme({
		B: Faces.B,
		R: Faces.U,
		U: Faces.L,
	});
	cube.state[2].scheme = mockPieceScheme({
		B: Faces.B,
		U: Faces.R,
		L: Faces.U,
	});

	const faces = toColoredFaceSlices(cube);

	expect(faces).toEqual({
		U: [
			[Colors.R, Colors.W, Colors.O],
			[Colors.W, Colors.W, Colors.W],
			[Colors.W, Colors.W, Colors.W],
		],
		F: [
			[Colors.G, Colors.G, Colors.G],
			[Colors.G, Colors.G, Colors.G],
			[Colors.G, Colors.G, Colors.G],
		],
		R: [
			[Colors.R, Colors.R, Colors.W],
			[Colors.R, Colors.R, Colors.R],
			[Colors.R, Colors.R, Colors.R],
		],
		D: [
			[Colors.Y, Colors.Y, Colors.Y],
			[Colors.Y, Colors.Y, Colors.Y],
			[Colors.Y, Colors.Y, Colors.Y],
		],
		B: [
			[Colors.B, Colors.B, Colors.B],
			[Colors.B, Colors.B, Colors.B],
			[Colors.B, Colors.B, Colors.B],
		],
		L: [
			[Colors.W, Colors.O, Colors.O],
			[Colors.O, Colors.O, Colors.O],
			[Colors.O, Colors.O, Colors.O],
		],
	} satisfies FaceSlices<Colors>);
});
