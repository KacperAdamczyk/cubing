import { expect, test } from "bun:test";
import { createCube } from "@/cube/factories/createCube";
import { rotateCube } from "@/cube/internal/rotateCube";
import { toFaceGrids } from "@/cube/internal/toFaceGrids";
import type { FaceGrids } from "@/cube/types/FaceGrids";
import { Face } from "@/cube/types/Face";
import { FundamentalMove } from "@/cube/types/Move";

test("rotates cube by R", () => {
	const cube = createCube();

	const rotatedCube = rotateCube(FundamentalMove.R, cube);

	expect(toFaceGrids(rotatedCube)).toEqual({
		U: [
			[Face.U, Face.U, Face.F],
			[Face.U, Face.U, Face.F],
			[Face.U, Face.U, Face.F],
		],
		F: [
			[Face.F, Face.F, Face.D],
			[Face.F, Face.F, Face.D],
			[Face.F, Face.F, Face.D],
		],
		R: [
			[Face.R, Face.R, Face.R],
			[Face.R, Face.R, Face.R],
			[Face.R, Face.R, Face.R],
		],
		D: [
			[Face.D, Face.D, Face.B],
			[Face.D, Face.D, Face.B],
			[Face.D, Face.D, Face.B],
		],
		B: [
			[Face.U, Face.B, Face.B],
			[Face.U, Face.B, Face.B],
			[Face.U, Face.B, Face.B],
		],
		L: [
			[Face.L, Face.L, Face.L],
			[Face.L, Face.L, Face.L],
			[Face.L, Face.L, Face.L],
		],
	} satisfies FaceGrids<Face>);
});

test("rotates cube by M", () => {
	const cube = createCube();

	const rotatedCube = rotateCube(FundamentalMove.M, cube);

	expect(toFaceGrids(rotatedCube)).toEqual({
		U: [
			[Face.U, Face.B, Face.U],
			[Face.U, Face.B, Face.U],
			[Face.U, Face.B, Face.U],
		],
		F: [
			[Face.F, Face.U, Face.F],
			[Face.F, Face.U, Face.F],
			[Face.F, Face.U, Face.F],
		],
		R: [
			[Face.R, Face.R, Face.R],
			[Face.R, Face.R, Face.R],
			[Face.R, Face.R, Face.R],
		],
		D: [
			[Face.D, Face.F, Face.D],
			[Face.D, Face.F, Face.D],
			[Face.D, Face.F, Face.D],
		],
		B: [
			[Face.B, Face.D, Face.B],
			[Face.B, Face.D, Face.B],
			[Face.B, Face.D, Face.B],
		],
		L: [
			[Face.L, Face.L, Face.L],
			[Face.L, Face.L, Face.L],
			[Face.L, Face.L, Face.L],
		],
	} satisfies FaceGrids<Face>);
});
