import { applyFundamentalMoves } from "@/cube/compound/applyFundamentalMoves";
import type { Cube } from "@/cube/types/Cube";
import { FundamentalMove, Move } from "@/cube/types/Move";

type MoveFn = (cube: Cube) => Cube;

const createMoveFn =
	(fundamentalMoves: FundamentalMove[]): MoveFn =>
	(cube) =>
		applyFundamentalMoves(fundamentalMoves, cube);

export const moveFns = {
	// U
	[Move.U]: createMoveFn([FundamentalMove.U]),
	[Move.U_]: createMoveFn([FundamentalMove.U_]),
	[Move.U2]: createMoveFn([FundamentalMove.U, FundamentalMove.U]),
	[Move.U2_]: createMoveFn([FundamentalMove.U_, FundamentalMove.U_]),
	[Move.u]: createMoveFn([FundamentalMove.U, FundamentalMove.E_]),
	[Move.u_]: createMoveFn([FundamentalMove.U_, FundamentalMove.E]),
	[Move.u2]: createMoveFn([
		FundamentalMove.U,
		FundamentalMove.U,
		FundamentalMove.E_,
		FundamentalMove.E_,
	]),
	[Move.u2_]: createMoveFn([
		FundamentalMove.U_,
		FundamentalMove.U_,
		FundamentalMove.E,
		FundamentalMove.E,
	]),
	// D
	[Move.D]: createMoveFn([FundamentalMove.D]),
	[Move.D_]: createMoveFn([FundamentalMove.D_]),
	[Move.D2]: createMoveFn([FundamentalMove.D, FundamentalMove.D]),
	[Move.D2_]: createMoveFn([FundamentalMove.D_, FundamentalMove.D_]),
	[Move.d]: createMoveFn([FundamentalMove.D, FundamentalMove.E]),
	[Move.d_]: createMoveFn([FundamentalMove.D_, FundamentalMove.E_]),
	[Move.d2]: createMoveFn([
		FundamentalMove.D,
		FundamentalMove.D,
		FundamentalMove.E,
		FundamentalMove.E,
	]),
	[Move.d2_]: createMoveFn([
		FundamentalMove.D_,
		FundamentalMove.D_,
		FundamentalMove.E_,
		FundamentalMove.E_,
	]),
	// L
	[Move.L]: createMoveFn([FundamentalMove.L]),
	[Move.L_]: createMoveFn([FundamentalMove.L_]),
	[Move.L2]: createMoveFn([FundamentalMove.L, FundamentalMove.L]),
	[Move.L2_]: createMoveFn([FundamentalMove.L_, FundamentalMove.L_]),
	[Move.l]: createMoveFn([FundamentalMove.L, FundamentalMove.M]),
	[Move.l_]: createMoveFn([FundamentalMove.L_, FundamentalMove.M_]),
	[Move.l2]: createMoveFn([
		FundamentalMove.L,
		FundamentalMove.L,
		FundamentalMove.M,
		FundamentalMove.M,
	]),
	[Move.l2_]: createMoveFn([
		FundamentalMove.L_,
		FundamentalMove.L_,
		FundamentalMove.M_,
		FundamentalMove.M_,
	]),
	// R
	[Move.R]: createMoveFn([FundamentalMove.R]),
	[Move.R_]: createMoveFn([FundamentalMove.R_]),
	[Move.R2]: createMoveFn([FundamentalMove.R, FundamentalMove.R]),
	[Move.R2_]: createMoveFn([FundamentalMove.R_, FundamentalMove.R_]),
	[Move.r]: createMoveFn([FundamentalMove.R, FundamentalMove.M_]),
	[Move.r_]: createMoveFn([FundamentalMove.R_, FundamentalMove.M]),
	[Move.r2]: createMoveFn([
		FundamentalMove.R,
		FundamentalMove.R,
		FundamentalMove.M_,
		FundamentalMove.M_,
	]),
	[Move.r2_]: createMoveFn([
		FundamentalMove.R_,
		FundamentalMove.R_,
		FundamentalMove.M,
		FundamentalMove.M,
	]),
	// F
	[Move.F]: createMoveFn([FundamentalMove.F]),
	[Move.F_]: createMoveFn([FundamentalMove.F_]),
	[Move.F2]: createMoveFn([FundamentalMove.F, FundamentalMove.F]),
	[Move.F2_]: createMoveFn([FundamentalMove.F_, FundamentalMove.F_]),
	[Move.f]: createMoveFn([FundamentalMove.F, FundamentalMove.S]),
	[Move.f_]: createMoveFn([FundamentalMove.F_, FundamentalMove.S_]),
	[Move.f2]: createMoveFn([
		FundamentalMove.F,
		FundamentalMove.F,
		FundamentalMove.S,
		FundamentalMove.S,
	]),
	[Move.f2_]: createMoveFn([
		FundamentalMove.F_,
		FundamentalMove.F_,
		FundamentalMove.S_,
		FundamentalMove.S_,
	]),
	// B
	[Move.B]: createMoveFn([FundamentalMove.B]),
	[Move.B_]: createMoveFn([FundamentalMove.B_]),
	[Move.B2]: createMoveFn([FundamentalMove.B, FundamentalMove.B]),
	[Move.B2_]: createMoveFn([FundamentalMove.B_, FundamentalMove.B_]),
	[Move.b]: createMoveFn([FundamentalMove.B, FundamentalMove.S_]),
	[Move.b_]: createMoveFn([FundamentalMove.B_, FundamentalMove.S]),
	[Move.b2]: createMoveFn([
		FundamentalMove.B,
		FundamentalMove.B,
		FundamentalMove.S_,
		FundamentalMove.S_,
	]),
	[Move.b2_]: createMoveFn([
		FundamentalMove.B_,
		FundamentalMove.B_,
		FundamentalMove.S,
		FundamentalMove.S,
	]),
	// M
	[Move.M]: createMoveFn([FundamentalMove.M]),
	[Move.M_]: createMoveFn([FundamentalMove.M_]),
	[Move.M2]: createMoveFn([FundamentalMove.M, FundamentalMove.M]),
	[Move.M2_]: createMoveFn([FundamentalMove.M_, FundamentalMove.M_]),
	// E
	[Move.E]: createMoveFn([FundamentalMove.E]),
	[Move.E_]: createMoveFn([FundamentalMove.E_]),
	[Move.E2]: createMoveFn([FundamentalMove.E, FundamentalMove.E]),
	[Move.E2_]: createMoveFn([FundamentalMove.E_, FundamentalMove.E_]),
	// S
	[Move.S]: createMoveFn([FundamentalMove.S]),
	[Move.S_]: createMoveFn([FundamentalMove.S_]),
	[Move.S2]: createMoveFn([FundamentalMove.S, FundamentalMove.S]),
	[Move.S2_]: createMoveFn([FundamentalMove.S_, FundamentalMove.S_]),
	// x
	[Move.x]: createMoveFn([
		FundamentalMove.R,
		FundamentalMove.M_,
		FundamentalMove.L_,
	]),
	[Move.x_]: createMoveFn([
		FundamentalMove.R_,
		FundamentalMove.M,
		FundamentalMove.L,
	]),
	[Move.x2]: createMoveFn([
		FundamentalMove.R,
		FundamentalMove.R,
		FundamentalMove.M_,
		FundamentalMove.M_,
		FundamentalMove.L_,
		FundamentalMove.L_,
	]),
	[Move.x2_]: createMoveFn([
		FundamentalMove.R_,
		FundamentalMove.R_,
		FundamentalMove.M,
		FundamentalMove.M,
		FundamentalMove.L,
		FundamentalMove.L,
	]),
	// y
	[Move.y]: createMoveFn([
		FundamentalMove.U,
		FundamentalMove.E_,
		FundamentalMove.D_,
	]),
	[Move.y_]: createMoveFn([
		FundamentalMove.U_,
		FundamentalMove.E,
		FundamentalMove.D,
	]),
	[Move.y2]: createMoveFn([
		FundamentalMove.U,
		FundamentalMove.U,
		FundamentalMove.E_,
		FundamentalMove.E_,
		FundamentalMove.D_,
		FundamentalMove.D_,
	]),
	[Move.y2_]: createMoveFn([
		FundamentalMove.U_,
		FundamentalMove.U_,
		FundamentalMove.E,
		FundamentalMove.E,
		FundamentalMove.D,
		FundamentalMove.D,
	]),
	// z
	[Move.z]: createMoveFn([
		FundamentalMove.F,
		FundamentalMove.S,
		FundamentalMove.B_,
	]),
	[Move.z_]: createMoveFn([
		FundamentalMove.F_,
		FundamentalMove.S_,
		FundamentalMove.B,
	]),
	[Move.z2]: createMoveFn([
		FundamentalMove.F,
		FundamentalMove.F,
		FundamentalMove.S,
		FundamentalMove.S,
		FundamentalMove.B_,
		FundamentalMove.B_,
	]),
	[Move.z2_]: createMoveFn([
		FundamentalMove.F_,
		FundamentalMove.F_,
		FundamentalMove.S_,
		FundamentalMove.S_,
		FundamentalMove.B,
		FundamentalMove.B,
	]),
} satisfies Record<Move, MoveFn>;
