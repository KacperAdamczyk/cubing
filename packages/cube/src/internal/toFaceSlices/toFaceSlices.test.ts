import { createCube } from "@/cube/initializers/createCube";
import { toFaceSlices } from "@/cube/internal/toFaceSlices";
import { mockPieceScheme } from "@/cube/test/mockPieceScheme";
import type { FaceSlices } from "@/cube/types/FaceSlices";
import { Faces } from "@/cube/types/Faces";
import { expect, test } from "vitest";

test("returns faces for a solved cube", () => {
	const faces = toFaceSlices(createCube());

	expect(faces).toEqual({
		U: [
			[Faces.U, Faces.U, Faces.U],
			[Faces.U, Faces.U, Faces.U],
			[Faces.U, Faces.U, Faces.U],
		],
		F: [
			[Faces.F, Faces.F, Faces.F],
			[Faces.F, Faces.F, Faces.F],
			[Faces.F, Faces.F, Faces.F],
		],
		R: [
			[Faces.R, Faces.R, Faces.R],
			[Faces.R, Faces.R, Faces.R],
			[Faces.R, Faces.R, Faces.R],
		],
		D: [
			[Faces.D, Faces.D, Faces.D],
			[Faces.D, Faces.D, Faces.D],
			[Faces.D, Faces.D, Faces.D],
		],
		B: [
			[Faces.B, Faces.B, Faces.B],
			[Faces.B, Faces.B, Faces.B],
			[Faces.B, Faces.B, Faces.B],
		],
		L: [
			[Faces.L, Faces.L, Faces.L],
			[Faces.L, Faces.L, Faces.L],
			[Faces.L, Faces.L, Faces.L],
		],
	} satisfies FaceSlices<Faces>);
});

test("returns faces for a cube with two pieces swapped", () => {
	const cube = createCube();

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

	const faces = toFaceSlices(cube);

	expect(faces).toEqual({
		U: [
			[Faces.R, Faces.U, Faces.L],
			[Faces.U, Faces.U, Faces.U],
			[Faces.U, Faces.U, Faces.U],
		],
		F: [
			[Faces.F, Faces.F, Faces.F],
			[Faces.F, Faces.F, Faces.F],
			[Faces.F, Faces.F, Faces.F],
		],
		R: [
			[Faces.R, Faces.R, Faces.U],
			[Faces.R, Faces.R, Faces.R],
			[Faces.R, Faces.R, Faces.R],
		],
		D: [
			[Faces.D, Faces.D, Faces.D],
			[Faces.D, Faces.D, Faces.D],
			[Faces.D, Faces.D, Faces.D],
		],
		B: [
			[Faces.B, Faces.B, Faces.B],
			[Faces.B, Faces.B, Faces.B],
			[Faces.B, Faces.B, Faces.B],
		],
		L: [
			[Faces.U, Faces.L, Faces.L],
			[Faces.L, Faces.L, Faces.L],
			[Faces.L, Faces.L, Faces.L],
		],
	} satisfies FaceSlices<Faces>);
});
