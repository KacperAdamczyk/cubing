import { expect, test } from "bun:test";
import { createCube } from "@/cube/factories/createCube";
import { toFaceGrids } from "@/cube/internal/toFaceGrids";
import { mockStickers } from "@/cube/test/mockStickers";
import type { FaceGrids } from "@/cube/types/FaceGrids";
import { Face } from "@/cube/types/Face";

test("returns faces for a solved cube", () => {
	const faces = toFaceGrids(createCube());

	expect(faces).toEqual({
		U: [
			[Face.U, Face.U, Face.U],
			[Face.U, Face.U, Face.U],
			[Face.U, Face.U, Face.U],
		],
		F: [
			[Face.F, Face.F, Face.F],
			[Face.F, Face.F, Face.F],
			[Face.F, Face.F, Face.F],
		],
		R: [
			[Face.R, Face.R, Face.R],
			[Face.R, Face.R, Face.R],
			[Face.R, Face.R, Face.R],
		],
		D: [
			[Face.D, Face.D, Face.D],
			[Face.D, Face.D, Face.D],
			[Face.D, Face.D, Face.D],
		],
		B: [
			[Face.B, Face.B, Face.B],
			[Face.B, Face.B, Face.B],
			[Face.B, Face.B, Face.B],
		],
		L: [
			[Face.L, Face.L, Face.L],
			[Face.L, Face.L, Face.L],
			[Face.L, Face.L, Face.L],
		],
	} satisfies FaceGrids<Face>);
});

test("returns faces for a cube with two pieces swapped", () => {
	const cube = createCube();

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

	const faces = toFaceGrids(cube);

	expect(faces).toEqual({
		U: [
			[Face.R, Face.U, Face.L],
			[Face.U, Face.U, Face.U],
			[Face.U, Face.U, Face.U],
		],
		F: [
			[Face.F, Face.F, Face.F],
			[Face.F, Face.F, Face.F],
			[Face.F, Face.F, Face.F],
		],
		R: [
			[Face.R, Face.R, Face.U],
			[Face.R, Face.R, Face.R],
			[Face.R, Face.R, Face.R],
		],
		D: [
			[Face.D, Face.D, Face.D],
			[Face.D, Face.D, Face.D],
			[Face.D, Face.D, Face.D],
		],
		B: [
			[Face.B, Face.B, Face.B],
			[Face.B, Face.B, Face.B],
			[Face.B, Face.B, Face.B],
		],
		L: [
			[Face.U, Face.L, Face.L],
			[Face.L, Face.L, Face.L],
			[Face.L, Face.L, Face.L],
		],
	} satisfies FaceGrids<Face>);
});
