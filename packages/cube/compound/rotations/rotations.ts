import { applyFundamentalRotations } from "@/compound/applyFundamentalRotations";
import type { Cube } from "@/types/Cube";
import { FundamentalRotations, Rotations } from "@/types/Rotations";

interface RotateFunction {
  (cube: Cube): Cube;
}

const createRotation =
  (fundamentalRotation: FundamentalRotations[]): RotateFunction =>
  (cube) =>
    applyFundamentalRotations(fundamentalRotation, cube);

export const rotations = {
  // U
  [Rotations.U]: createRotation([FundamentalRotations.U]),
  [Rotations.U_]: createRotation([FundamentalRotations.U_]),
  [Rotations.U2]: createRotation([
    FundamentalRotations.U,
    FundamentalRotations.U,
  ]),
  [Rotations.U2_]: createRotation([
    FundamentalRotations.U_,
    FundamentalRotations.U_,
  ]),
  [Rotations.u]: createRotation([
    FundamentalRotations.U,
    FundamentalRotations.E_,
  ]),
  [Rotations.u_]: createRotation([
    FundamentalRotations.U_,
    FundamentalRotations.E,
  ]),
  [Rotations.u2]: createRotation([
    FundamentalRotations.U,
    FundamentalRotations.U,
    FundamentalRotations.E_,
    FundamentalRotations.E_,
  ]),
  [Rotations.u2_]: createRotation([
    FundamentalRotations.U_,
    FundamentalRotations.U_,
    FundamentalRotations.E,
    FundamentalRotations.E,
  ]),
  // D
  [Rotations.D]: createRotation([FundamentalRotations.D]),
  [Rotations.D_]: createRotation([FundamentalRotations.D_]),
  [Rotations.D2]: createRotation([
    FundamentalRotations.D,
    FundamentalRotations.D,
  ]),
  [Rotations.D2_]: createRotation([
    FundamentalRotations.D_,
    FundamentalRotations.D_,
  ]),
  [Rotations.d]: createRotation([
    FundamentalRotations.D,
    FundamentalRotations.E,
  ]),
  [Rotations.d_]: createRotation([
    FundamentalRotations.D_,
    FundamentalRotations.E_,
  ]),
  [Rotations.d2]: createRotation([
    FundamentalRotations.D,
    FundamentalRotations.D,
    FundamentalRotations.E,
    FundamentalRotations.E,
  ]),
  [Rotations.d2_]: createRotation([
    FundamentalRotations.D_,
    FundamentalRotations.D_,
    FundamentalRotations.E_,
    FundamentalRotations.E_,
  ]),
  // L
  [Rotations.L]: createRotation([FundamentalRotations.L]),
  [Rotations.L_]: createRotation([FundamentalRotations.L_]),
  [Rotations.L2]: createRotation([
    FundamentalRotations.L,
    FundamentalRotations.L,
  ]),
  [Rotations.L2_]: createRotation([
    FundamentalRotations.L_,
    FundamentalRotations.L_,
  ]),
  [Rotations.l]: createRotation([
    FundamentalRotations.L,
    FundamentalRotations.M,
  ]),
  [Rotations.l_]: createRotation([
    FundamentalRotations.L_,
    FundamentalRotations.M_,
  ]),
  [Rotations.l2]: createRotation([
    FundamentalRotations.L,
    FundamentalRotations.L,
    FundamentalRotations.M,
    FundamentalRotations.M,
  ]),
  [Rotations.l2_]: createRotation([
    FundamentalRotations.L_,
    FundamentalRotations.L_,
    FundamentalRotations.M_,
    FundamentalRotations.M_,
  ]),
  // R
  [Rotations.R]: createRotation([FundamentalRotations.R]),
  [Rotations.R_]: createRotation([FundamentalRotations.R_]),
  [Rotations.R2]: createRotation([
    FundamentalRotations.R,
    FundamentalRotations.R,
  ]),
  [Rotations.R2_]: createRotation([
    FundamentalRotations.R_,
    FundamentalRotations.R_,
  ]),
  [Rotations.r]: createRotation([
    FundamentalRotations.R,
    FundamentalRotations.M_,
  ]),
  [Rotations.r_]: createRotation([
    FundamentalRotations.R_,
    FundamentalRotations.M,
  ]),
  [Rotations.r2]: createRotation([
    FundamentalRotations.R,
    FundamentalRotations.R,
    FundamentalRotations.M_,
    FundamentalRotations.M_,
  ]),
  [Rotations.r2_]: createRotation([
    FundamentalRotations.R_,
    FundamentalRotations.R_,
    FundamentalRotations.M,
    FundamentalRotations.M,
  ]),
  // F
  [Rotations.F]: createRotation([FundamentalRotations.F]),
  [Rotations.F_]: createRotation([FundamentalRotations.F_]),
  [Rotations.F2]: createRotation([
    FundamentalRotations.F,
    FundamentalRotations.F,
  ]),
  [Rotations.F2_]: createRotation([
    FundamentalRotations.F_,
    FundamentalRotations.F_,
  ]),
  [Rotations.f]: createRotation([
    FundamentalRotations.F,
    FundamentalRotations.S,
  ]),
  [Rotations.f_]: createRotation([
    FundamentalRotations.F_,
    FundamentalRotations.S_,
  ]),
  [Rotations.f2]: createRotation([
    FundamentalRotations.F,
    FundamentalRotations.F,
    FundamentalRotations.S,
    FundamentalRotations.S,
  ]),
  [Rotations.f2_]: createRotation([
    FundamentalRotations.F_,
    FundamentalRotations.F_,
    FundamentalRotations.S_,
    FundamentalRotations.S_,
  ]),
  // B
  [Rotations.B]: createRotation([FundamentalRotations.B]),
  [Rotations.B_]: createRotation([FundamentalRotations.B_]),
  [Rotations.B2]: createRotation([
    FundamentalRotations.B,
    FundamentalRotations.B,
  ]),
  [Rotations.B2_]: createRotation([
    FundamentalRotations.B_,
    FundamentalRotations.B_,
  ]),
  [Rotations.b]: createRotation([
    FundamentalRotations.B,
    FundamentalRotations.S_,
  ]),
  [Rotations.b_]: createRotation([
    FundamentalRotations.B_,
    FundamentalRotations.S,
  ]),
  [Rotations.b2]: createRotation([
    FundamentalRotations.B,
    FundamentalRotations.B,
    FundamentalRotations.S_,
    FundamentalRotations.S_,
  ]),
  [Rotations.b2_]: createRotation([
    FundamentalRotations.B_,
    FundamentalRotations.B_,
    FundamentalRotations.S,
    FundamentalRotations.S,
  ]),
  // M
  [Rotations.M]: createRotation([FundamentalRotations.M]),
  [Rotations.M_]: createRotation([FundamentalRotations.M_]),
  [Rotations.M2]: createRotation([
    FundamentalRotations.M,
    FundamentalRotations.M,
  ]),
  [Rotations.M2_]: createRotation([
    FundamentalRotations.M_,
    FundamentalRotations.M_,
  ]),
  // E
  [Rotations.E]: createRotation([FundamentalRotations.E]),
  [Rotations.E_]: createRotation([FundamentalRotations.E_]),
  [Rotations.E2]: createRotation([
    FundamentalRotations.E,
    FundamentalRotations.E,
  ]),
  [Rotations.E2_]: createRotation([
    FundamentalRotations.E_,
    FundamentalRotations.E_,
  ]),
  // S
  [Rotations.S]: createRotation([FundamentalRotations.S]),
  [Rotations.S_]: createRotation([FundamentalRotations.S_]),
  [Rotations.S2]: createRotation([
    FundamentalRotations.S,
    FundamentalRotations.S,
  ]),
  [Rotations.S2_]: createRotation([
    FundamentalRotations.S_,
    FundamentalRotations.S_,
  ]),
  // x
  [Rotations.x]: createRotation([
    FundamentalRotations.R,
    FundamentalRotations.M_,
    FundamentalRotations.L_,
  ]),
  [Rotations.x_]: createRotation([
    FundamentalRotations.R_,
    FundamentalRotations.M,
    FundamentalRotations.L,
  ]),
  [Rotations.x2]: createRotation([
    FundamentalRotations.R,
    FundamentalRotations.R,
    FundamentalRotations.M_,
    FundamentalRotations.M_,
    FundamentalRotations.L_,
    FundamentalRotations.L_,
  ]),
  [Rotations.x2_]: createRotation([
    FundamentalRotations.R_,
    FundamentalRotations.R_,
    FundamentalRotations.M,
    FundamentalRotations.M,
    FundamentalRotations.L,
    FundamentalRotations.L,
  ]),
  // y
  [Rotations.y]: createRotation([
    FundamentalRotations.U,
    FundamentalRotations.E_,
    FundamentalRotations.D_,
  ]),
  [Rotations.y_]: createRotation([
    FundamentalRotations.U_,
    FundamentalRotations.E,
    FundamentalRotations.D,
  ]),
  [Rotations.y2]: createRotation([
    FundamentalRotations.U,
    FundamentalRotations.U,
    FundamentalRotations.E_,
    FundamentalRotations.E_,
    FundamentalRotations.D_,
    FundamentalRotations.D_,
  ]),
  [Rotations.y2_]: createRotation([
    FundamentalRotations.U_,
    FundamentalRotations.U_,
    FundamentalRotations.E,
    FundamentalRotations.E,
    FundamentalRotations.D,
    FundamentalRotations.D,
  ]),
  // z
  [Rotations.z]: createRotation([
    FundamentalRotations.F,
    FundamentalRotations.S,
    FundamentalRotations.B_,
  ]),
  [Rotations.z_]: createRotation([
    FundamentalRotations.F_,
    FundamentalRotations.S_,
    FundamentalRotations.B,
  ]),
  [Rotations.z2]: createRotation([
    FundamentalRotations.F,
    FundamentalRotations.F,
    FundamentalRotations.S,
    FundamentalRotations.S,
    FundamentalRotations.B_,
    FundamentalRotations.B_,
  ]),
  [Rotations.z2_]: createRotation([
    FundamentalRotations.F_,
    FundamentalRotations.F_,
    FundamentalRotations.S_,
    FundamentalRotations.S_,
    FundamentalRotations.B,
    FundamentalRotations.B,
  ]),
} satisfies Record<Rotations, RotateFunction>;
