import { createCube } from "@/initializers/createCube";
import { rotateCube } from "@/internal/rotateCube";
import { toFaceSlices } from "@/internal/toFaceSlices";
import type { FaceSlices } from "@/types/FaceSlices";
import { Faces } from "@/types/Faces";
import { FundamentalRotations } from "@/types/Rotations";
import { expect, test } from "vitest";

test("rotates cube by R", () => {
	const cube = createCube();

	const rotatedCube = rotateCube(FundamentalRotations.R, cube);

	expect(toFaceSlices(rotatedCube)).toEqual({
		U: [
			[Faces.U, Faces.U, Faces.F],
			[Faces.U, Faces.U, Faces.F],
			[Faces.U, Faces.U, Faces.F],
		],
		F: [
			[Faces.F, Faces.F, Faces.D],
			[Faces.F, Faces.F, Faces.D],
			[Faces.F, Faces.F, Faces.D],
		],
		R: [
			[Faces.R, Faces.R, Faces.R],
			[Faces.R, Faces.R, Faces.R],
			[Faces.R, Faces.R, Faces.R],
		],
		D: [
			[Faces.D, Faces.D, Faces.B],
			[Faces.D, Faces.D, Faces.B],
			[Faces.D, Faces.D, Faces.B],
		],
		B: [
			[Faces.U, Faces.B, Faces.B],
			[Faces.U, Faces.B, Faces.B],
			[Faces.U, Faces.B, Faces.B],
		],
		L: [
			[Faces.L, Faces.L, Faces.L],
			[Faces.L, Faces.L, Faces.L],
			[Faces.L, Faces.L, Faces.L],
		],
	} satisfies FaceSlices<Faces>);
});

test("rotates cube by M", () => {
	const cube = createCube();

	const rotatedCube = rotateCube(FundamentalRotations.M, cube);

	expect(toFaceSlices(rotatedCube)).toEqual({
		U: [
			[Faces.U, Faces.B, Faces.U],
			[Faces.U, Faces.B, Faces.U],
			[Faces.U, Faces.B, Faces.U],
		],
		F: [
			[Faces.F, Faces.U, Faces.F],
			[Faces.F, Faces.U, Faces.F],
			[Faces.F, Faces.U, Faces.F],
		],
		R: [
			[Faces.R, Faces.R, Faces.R],
			[Faces.R, Faces.R, Faces.R],
			[Faces.R, Faces.R, Faces.R],
		],
		D: [
			[Faces.D, Faces.F, Faces.D],
			[Faces.D, Faces.F, Faces.D],
			[Faces.D, Faces.F, Faces.D],
		],
		B: [
			[Faces.B, Faces.D, Faces.B],
			[Faces.B, Faces.D, Faces.B],
			[Faces.B, Faces.D, Faces.B],
		],
		L: [
			[Faces.L, Faces.L, Faces.L],
			[Faces.L, Faces.L, Faces.L],
			[Faces.L, Faces.L, Faces.L],
		],
	} satisfies FaceSlices<Faces>);
});
