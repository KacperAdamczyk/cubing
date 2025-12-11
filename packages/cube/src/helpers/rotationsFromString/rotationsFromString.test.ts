import { expect, test } from "bun:test";
import { rotationsFromString } from "@/cube/helpers/rotationsFromString";
import { Rotations } from "@/cube/types/Rotations";

test("converts all possible rotations from string", () => {
	const rotations = rotationsFromString(
		"R R' R2 R2' r r' r2 r2'" +
			" L L' L2 L2' l l' l2 l2'" +
			" U U' U2 U2' u u' u2 u2'" +
			" D D' D2 D2' d d' d2 d2'" +
			" F F' F2 F2' f f' f2 f2'" +
			" B B' B2 B2' b b' b2 b2'" +
			" M M' M2 M2' E E' E2 E2' S S' S2 S2'" +
			" x x' x2 x2' y y' y2 y2' z z' z2 z2'",
	);

	expect(rotations).toEqual([
		Rotations.R,
		Rotations.R_,
		Rotations.R2,
		Rotations.R2_,
		Rotations.r,
		Rotations.r_,
		Rotations.r2,
		Rotations.r2_,

		Rotations.L,
		Rotations.L_,
		Rotations.L2,
		Rotations.L2_,
		Rotations.l,
		Rotations.l_,
		Rotations.l2,
		Rotations.l2_,

		Rotations.U,
		Rotations.U_,
		Rotations.U2,
		Rotations.U2_,
		Rotations.u,
		Rotations.u_,
		Rotations.u2,
		Rotations.u2_,

		Rotations.D,
		Rotations.D_,
		Rotations.D2,
		Rotations.D2_,
		Rotations.d,
		Rotations.d_,
		Rotations.d2,
		Rotations.d2_,

		Rotations.F,
		Rotations.F_,
		Rotations.F2,
		Rotations.F2_,
		Rotations.f,
		Rotations.f_,
		Rotations.f2,
		Rotations.f2_,

		Rotations.B,
		Rotations.B_,
		Rotations.B2,
		Rotations.B2_,
		Rotations.b,
		Rotations.b_,
		Rotations.b2,
		Rotations.b2_,

		Rotations.M,
		Rotations.M_,
		Rotations.M2,
		Rotations.M2_,

		Rotations.E,
		Rotations.E_,
		Rotations.E2,
		Rotations.E2_,

		Rotations.S,
		Rotations.S_,
		Rotations.S2,
		Rotations.S2_,

		Rotations.x,
		Rotations.x_,
		Rotations.x2,
		Rotations.x2_,

		Rotations.y,
		Rotations.y_,
		Rotations.y2,
		Rotations.y2_,

		Rotations.z,
		Rotations.z_,
		Rotations.z2,
		Rotations.z2_,
	]);

	expect(rotations.length).toBe(72);
});

test("skips parentheses", () => {
	const rotations = rotationsFromString("F (R U R' U') F' f (R U R' U') f'");

	expect(rotations).toEqual([
		Rotations.F,
		Rotations.R,
		Rotations.U,
		Rotations.R_,
		Rotations.U_,
		Rotations.F_,
		Rotations.f,
		Rotations.R,
		Rotations.U,
		Rotations.R_,
		Rotations.U_,
		Rotations.f_,
	]);
});

test("skips unknown rotations", () => {
	const rotations = rotationsFromString(
		"F (R U R' U') W F' f Z G' (R U R' U') f' x",
	);

	expect(rotations).toEqual([
		Rotations.F,
		Rotations.R,
		Rotations.U,
		Rotations.R_,
		Rotations.U_,
		Rotations.F_,
		Rotations.f,
		Rotations.R,
		Rotations.U,
		Rotations.R_,
		Rotations.U_,
		Rotations.f_,
		Rotations.x,
	]);
});
