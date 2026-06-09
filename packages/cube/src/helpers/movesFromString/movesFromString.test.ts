import { expect, test } from "bun:test";
import { movesFromString } from "@/cube/helpers/movesFromString";
import { Move } from "@/cube/types/Move";

test("converts all possible rotations from string", () => {
	const rotations = movesFromString(
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
		Move.R,
		Move.R_,
		Move.R2,
		Move.R2_,
		Move.r,
		Move.r_,
		Move.r2,
		Move.r2_,

		Move.L,
		Move.L_,
		Move.L2,
		Move.L2_,
		Move.l,
		Move.l_,
		Move.l2,
		Move.l2_,

		Move.U,
		Move.U_,
		Move.U2,
		Move.U2_,
		Move.u,
		Move.u_,
		Move.u2,
		Move.u2_,

		Move.D,
		Move.D_,
		Move.D2,
		Move.D2_,
		Move.d,
		Move.d_,
		Move.d2,
		Move.d2_,

		Move.F,
		Move.F_,
		Move.F2,
		Move.F2_,
		Move.f,
		Move.f_,
		Move.f2,
		Move.f2_,

		Move.B,
		Move.B_,
		Move.B2,
		Move.B2_,
		Move.b,
		Move.b_,
		Move.b2,
		Move.b2_,

		Move.M,
		Move.M_,
		Move.M2,
		Move.M2_,

		Move.E,
		Move.E_,
		Move.E2,
		Move.E2_,

		Move.S,
		Move.S_,
		Move.S2,
		Move.S2_,

		Move.x,
		Move.x_,
		Move.x2,
		Move.x2_,

		Move.y,
		Move.y_,
		Move.y2,
		Move.y2_,

		Move.z,
		Move.z_,
		Move.z2,
		Move.z2_,
	]);

	expect(rotations.length).toBe(72);
});

test("skips parentheses", () => {
	const rotations = movesFromString("F (R U R' U') F' f (R U R' U') f'");

	expect(rotations).toEqual([
		Move.F,
		Move.R,
		Move.U,
		Move.R_,
		Move.U_,
		Move.F_,
		Move.f,
		Move.R,
		Move.U,
		Move.R_,
		Move.U_,
		Move.f_,
	]);
});

test("skips unknown rotations", () => {
	const rotations = movesFromString(
		"F (R U R' U') W F' f Z G' (R U R' U') f' x",
	);

	expect(rotations).toEqual([
		Move.F,
		Move.R,
		Move.U,
		Move.R_,
		Move.U_,
		Move.F_,
		Move.f,
		Move.R,
		Move.U,
		Move.R_,
		Move.U_,
		Move.f_,
		Move.x,
	]);
});
