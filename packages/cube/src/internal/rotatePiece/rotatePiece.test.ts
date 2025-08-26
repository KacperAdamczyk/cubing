import { pieceIds } from "@/cube/helpers/pieceIds";
import { createPieceScheme } from "@/cube/initializers/createPieceScheme";
import { rotatePiece } from "@/cube/internal/rotatePiece";
import { mockPieceScheme } from "@/cube/test/mockPieceScheme";
import { Faces } from "@/cube/types/Faces";
import { PieceType } from "@/cube/types/Piece";
import type { PieceScheme } from "@/cube/types/PieceScheme";
import { FundamentalRotations } from "@/cube/types/Rotations";
import { expect, test } from "vitest";

const c = createPieceScheme;
const m = mockPieceScheme;
const F = Faces;

test.each`
	id          | rotation                   | scheme             | expectedScheme
	${"U-1-C"}  | ${FundamentalRotations.U}  | ${c(pieceIds.BLU)} | ${m({ U: F.U, R: F.B, B: F.L })}
	${"U-2-C"}  | ${FundamentalRotations.U}  | ${c(pieceIds.BRU)} | ${m({ U: F.U, R: F.B, F: F.R })}
	${"U-3-C"}  | ${FundamentalRotations.U}  | ${c(pieceIds.FRU)} | ${m({ U: F.U, L: F.F, F: F.R })}
	${"U-4-C"}  | ${FundamentalRotations.U}  | ${c(pieceIds.FLU)} | ${m({ U: F.U, L: F.F, B: F.L })}
	${"U-5-E"}  | ${FundamentalRotations.U}  | ${c(pieceIds.BU)}  | ${m({ U: F.U, R: F.B })}
	${"U-6-E"}  | ${FundamentalRotations.U}  | ${c(pieceIds.RU)}  | ${m({ U: F.U, F: F.R })}
	${"U-7-E"}  | ${FundamentalRotations.U}  | ${c(pieceIds.FU)}  | ${m({ U: F.U, L: F.F })}
	${"U-8-E"}  | ${FundamentalRotations.U}  | ${c(pieceIds.LU)}  | ${m({ U: F.U, B: F.L })}
	${"U-9-C"}  | ${FundamentalRotations.U_} | ${c(pieceIds.BLU)} | ${m({ U: F.U, L: F.B, F: F.L })}
	${"U-10-C"} | ${FundamentalRotations.U_} | ${c(pieceIds.BRU)} | ${m({ U: F.U, L: F.B, B: F.R })}
	${"U-11-C"} | ${FundamentalRotations.U_} | ${c(pieceIds.FRU)} | ${m({ U: F.U, R: F.F, B: F.R })}
	${"U-12-C"} | ${FundamentalRotations.U_} | ${c(pieceIds.FLU)} | ${m({ U: F.U, R: F.F, F: F.L })}
	${"U-13-E"} | ${FundamentalRotations.U_} | ${c(pieceIds.BU)}  | ${m({ U: F.U, L: F.B })}
	${"U-14-E"} | ${FundamentalRotations.U_} | ${c(pieceIds.RU)}  | ${m({ U: F.U, B: F.R })}
	${"U-15-E"} | ${FundamentalRotations.U_} | ${c(pieceIds.FU)}  | ${m({ U: F.U, R: F.F })}
	${"U-16-E"} | ${FundamentalRotations.U_} | ${c(pieceIds.LU)}  | ${m({ U: F.U, F: F.L })}
	${"D-1-C"}  | ${FundamentalRotations.D}  | ${c(pieceIds.BDL)} | ${m({ D: F.D, L: F.B, F: F.L })}
	${"D-2-C"}  | ${FundamentalRotations.D}  | ${c(pieceIds.BDR)} | ${m({ D: F.D, L: F.B, B: F.R })}
	${"D-3-C"}  | ${FundamentalRotations.D}  | ${c(pieceIds.DFR)} | ${m({ D: F.D, R: F.F, B: F.R })}
	${"D-4-C"}  | ${FundamentalRotations.D}  | ${c(pieceIds.DFL)} | ${m({ D: F.D, R: F.F, F: F.L })}
	${"D-5-E"}  | ${FundamentalRotations.D}  | ${c(pieceIds.BD)}  | ${m({ D: F.D, L: F.B })}
	${"D-6-E"}  | ${FundamentalRotations.D}  | ${c(pieceIds.DR)}  | ${m({ D: F.D, B: F.R })}
	${"D-7-E"}  | ${FundamentalRotations.D}  | ${c(pieceIds.DF)}  | ${m({ D: F.D, R: F.F })}
	${"D-8-E"}  | ${FundamentalRotations.D}  | ${c(pieceIds.DL)}  | ${m({ D: F.D, F: F.L })}
	${"D-9-C"}  | ${FundamentalRotations.D_} | ${c(pieceIds.BDL)} | ${m({ D: F.D, R: F.B, B: F.L })}
	${"D-10-C"} | ${FundamentalRotations.D_} | ${c(pieceIds.BDR)} | ${m({ D: F.D, R: F.B, F: F.R })}
	${"D-11-C"} | ${FundamentalRotations.D_} | ${c(pieceIds.DFR)} | ${m({ D: F.D, L: F.F, F: F.R })}
	${"D-12-C"} | ${FundamentalRotations.D_} | ${c(pieceIds.DFL)} | ${m({ D: F.D, L: F.F, B: F.L })}
	${"D-13-E"} | ${FundamentalRotations.D_} | ${c(pieceIds.BD)}  | ${m({ D: F.D, R: F.B })}
	${"D-14-E"} | ${FundamentalRotations.D_} | ${c(pieceIds.DR)}  | ${m({ D: F.D, F: F.R })}
	${"D-15-E"} | ${FundamentalRotations.D_} | ${c(pieceIds.DF)}  | ${m({ D: F.D, L: F.F })}
	${"D-16-E"} | ${FundamentalRotations.D_} | ${c(pieceIds.DL)}  | ${m({ D: F.D, B: F.L })}
	${"R-1-C"}  | ${FundamentalRotations.R}  | ${c(pieceIds.BRU)} | ${m({ R: F.R, B: F.U, D: F.B })}
	${"R-2-C"}  | ${FundamentalRotations.R}  | ${c(pieceIds.BDR)} | ${m({ R: F.R, D: F.B, F: F.D })}
	${"R-3-C"}  | ${FundamentalRotations.R}  | ${c(pieceIds.DFR)} | ${m({ R: F.R, F: F.D, U: F.F })}
	${"R-4-C"}  | ${FundamentalRotations.R}  | ${c(pieceIds.FRU)} | ${m({ R: F.R, B: F.U, U: F.F })}
	${"R-5-E"}  | ${FundamentalRotations.R}  | ${c(pieceIds.RU)}  | ${m({ R: F.R, B: F.U })}
	${"R-6-E"}  | ${FundamentalRotations.R}  | ${c(pieceIds.BR)}  | ${m({ R: F.R, D: F.B })}
	${"R-7-E"}  | ${FundamentalRotations.R}  | ${c(pieceIds.DR)}  | ${m({ R: F.R, F: F.D })}
	${"R-8-E"}  | ${FundamentalRotations.R}  | ${c(pieceIds.FR)}  | ${m({ R: F.R, U: F.F })}
	${"R-9-C"}  | ${FundamentalRotations.R_} | ${c(pieceIds.BRU)} | ${m({ R: F.R, U: F.B, F: F.U })}
	${"R-10-C"} | ${FundamentalRotations.R_} | ${c(pieceIds.BDR)} | ${m({ R: F.R, U: F.B, B: F.D })}
	${"R-11-C"} | ${FundamentalRotations.R_} | ${c(pieceIds.DFR)} | ${m({ R: F.R, B: F.D, D: F.F })}
	${"R-12-C"} | ${FundamentalRotations.R_} | ${c(pieceIds.FRU)} | ${m({ R: F.R, F: F.U, D: F.F })}
	${"R-13-E"} | ${FundamentalRotations.R_} | ${c(pieceIds.RU)}  | ${m({ R: F.R, F: F.U })}
	${"R-14-E"} | ${FundamentalRotations.R_} | ${c(pieceIds.BR)}  | ${m({ R: F.R, U: F.B })}
	${"R-15-E"} | ${FundamentalRotations.R_} | ${c(pieceIds.DR)}  | ${m({ R: F.R, B: F.D })}
	${"R-16-E"} | ${FundamentalRotations.R_} | ${c(pieceIds.FR)}  | ${m({ R: F.R, D: F.F })}
	${"L-1-C"}  | ${FundamentalRotations.L}  | ${c(pieceIds.BRU)} | ${m({ R: F.R, U: F.B, F: F.U })}
	${"L-2-C"}  | ${FundamentalRotations.L}  | ${c(pieceIds.BDR)} | ${m({ R: F.R, U: F.B, B: F.D })}
	${"L-3-C"}  | ${FundamentalRotations.L}  | ${c(pieceIds.DFR)} | ${m({ R: F.R, B: F.D, D: F.F })}
	${"L-4-C"}  | ${FundamentalRotations.L}  | ${c(pieceIds.FRU)} | ${m({ R: F.R, F: F.U, D: F.F })}
	${"L-5-E"}  | ${FundamentalRotations.L}  | ${c(pieceIds.RU)}  | ${m({ R: F.R, F: F.U })}
	${"L-6-E"}  | ${FundamentalRotations.L}  | ${c(pieceIds.BR)}  | ${m({ R: F.R, U: F.B })}
	${"L-7-E"}  | ${FundamentalRotations.L}  | ${c(pieceIds.DR)}  | ${m({ R: F.R, B: F.D })}
	${"L-8-E"}  | ${FundamentalRotations.L}  | ${c(pieceIds.FR)}  | ${m({ R: F.R, D: F.F })}
	${"L-9-C"}  | ${FundamentalRotations.L_} | ${c(pieceIds.BRU)} | ${m({ R: F.R, B: F.U, D: F.B })}
	${"L-10-C"} | ${FundamentalRotations.L_} | ${c(pieceIds.BDR)} | ${m({ R: F.R, D: F.B, F: F.D })}
	${"L-11-C"} | ${FundamentalRotations.L_} | ${c(pieceIds.DFR)} | ${m({ R: F.R, F: F.D, U: F.F })}
	${"L-12-C"} | ${FundamentalRotations.L_} | ${c(pieceIds.FRU)} | ${m({ R: F.R, B: F.U, U: F.F })}
	${"L-13-E"} | ${FundamentalRotations.L_} | ${c(pieceIds.RU)}  | ${m({ R: F.R, B: F.U })}
	${"L-14-E"} | ${FundamentalRotations.L_} | ${c(pieceIds.BR)}  | ${m({ R: F.R, D: F.B })}
	${"L-15-E"} | ${FundamentalRotations.L_} | ${c(pieceIds.DR)}  | ${m({ R: F.R, F: F.D })}
	${"L-16-E"} | ${FundamentalRotations.L_} | ${c(pieceIds.FR)}  | ${m({ R: F.R, U: F.F })}
	${"F-1-C"}  | ${FundamentalRotations.F}  | ${c(pieceIds.FLU)} | ${m({ F: F.F, U: F.L, R: F.U })}
	${"F-2-C"}  | ${FundamentalRotations.F}  | ${c(pieceIds.FRU)} | ${m({ F: F.F, R: F.U, D: F.R })}
	${"F-3-C"}  | ${FundamentalRotations.F}  | ${c(pieceIds.DFR)} | ${m({ F: F.F, L: F.D, D: F.R })}
	${"F-4-C"}  | ${FundamentalRotations.F}  | ${c(pieceIds.DFL)} | ${m({ F: F.F, L: F.D, U: F.L })}
	${"F-5-E"}  | ${FundamentalRotations.F}  | ${c(pieceIds.FU)}  | ${m({ F: F.F, R: F.U })}
	${"F-6-E"}  | ${FundamentalRotations.F}  | ${c(pieceIds.FR)}  | ${m({ F: F.F, D: F.R })}
	${"F-7-E"}  | ${FundamentalRotations.F}  | ${c(pieceIds.DF)}  | ${m({ F: F.F, L: F.D })}
	${"F-8-E"}  | ${FundamentalRotations.F}  | ${c(pieceIds.FL)}  | ${m({ F: F.F, U: F.L })}
	${"F-1-C"}  | ${FundamentalRotations.F_} | ${c(pieceIds.FLU)} | ${m({ F: F.F, L: F.U, D: F.L })}
	${"F-1-C"}  | ${FundamentalRotations.F_} | ${c(pieceIds.FRU)} | ${m({ F: F.F, L: F.U, U: F.R })}
	${"F-1-C"}  | ${FundamentalRotations.F_} | ${c(pieceIds.DFR)} | ${m({ F: F.F, R: F.D, U: F.R })}
	${"F-1-C"}  | ${FundamentalRotations.F_} | ${c(pieceIds.DFL)} | ${m({ F: F.F, R: F.D, D: F.L })}
	${"F-1-C"}  | ${FundamentalRotations.F_} | ${c(pieceIds.FU)}  | ${m({ F: F.F, L: F.U })}
	${"F-1-C"}  | ${FundamentalRotations.F_} | ${c(pieceIds.FR)}  | ${m({ F: F.F, U: F.R })}
	${"F-1-C"}  | ${FundamentalRotations.F_} | ${c(pieceIds.DF)}  | ${m({ F: F.F, R: F.D })}
	${"F-1-C"}  | ${FundamentalRotations.F_} | ${c(pieceIds.FL)}  | ${m({ F: F.F, D: F.L })}
	${"B-1-C"}  | ${FundamentalRotations.B}  | ${c(pieceIds.FLU)} | ${m({ F: F.F, L: F.U, D: F.L })}
	${"B-2-C"}  | ${FundamentalRotations.B}  | ${c(pieceIds.FRU)} | ${m({ F: F.F, L: F.U, U: F.R })}
	${"B-3-C"}  | ${FundamentalRotations.B}  | ${c(pieceIds.DFR)} | ${m({ F: F.F, R: F.D, U: F.R })}
	${"B-4-C"}  | ${FundamentalRotations.B}  | ${c(pieceIds.DFL)} | ${m({ F: F.F, R: F.D, D: F.L })}
	${"B-5-C"}  | ${FundamentalRotations.B}  | ${c(pieceIds.FU)}  | ${m({ F: F.F, L: F.U })}
	${"B-6-C"}  | ${FundamentalRotations.B}  | ${c(pieceIds.FR)}  | ${m({ F: F.F, U: F.R })}
	${"B-7-C"}  | ${FundamentalRotations.B}  | ${c(pieceIds.DF)}  | ${m({ F: F.F, R: F.D })}
	${"B-8-C"}  | ${FundamentalRotations.B}  | ${c(pieceIds.FL)}  | ${m({ F: F.F, D: F.L })}
	${"B-9-C"}  | ${FundamentalRotations.B_} | ${c(pieceIds.FLU)} | ${m({ F: F.F, U: F.L, R: F.U })}
	${"B-10-C"} | ${FundamentalRotations.B_} | ${c(pieceIds.FRU)} | ${m({ F: F.F, R: F.U, D: F.R })}
	${"B-11-C"} | ${FundamentalRotations.B_} | ${c(pieceIds.DFR)} | ${m({ F: F.F, L: F.D, D: F.R })}
	${"B-12-C"} | ${FundamentalRotations.B_} | ${c(pieceIds.DFL)} | ${m({ F: F.F, L: F.D, U: F.L })}
	${"B-13-E"} | ${FundamentalRotations.B_} | ${c(pieceIds.FU)}  | ${m({ F: F.F, R: F.U })}
	${"B-14-E"} | ${FundamentalRotations.B_} | ${c(pieceIds.FR)}  | ${m({ F: F.F, D: F.R })}
	${"B-15-E"} | ${FundamentalRotations.B_} | ${c(pieceIds.DF)}  | ${m({ F: F.F, L: F.D })}
	${"B-16-E"} | ${FundamentalRotations.B_} | ${c(pieceIds.FL)}  | ${m({ F: F.F, U: F.L })}
	${"M-1-E"}  | ${FundamentalRotations.M}  | ${c(pieceIds.BU)}  | ${m({ U: F.B, F: F.U })}
	${"M-3-E"}  | ${FundamentalRotations.M}  | ${c(pieceIds.FU)}  | ${m({ F: F.U, D: F.F })}
	${"M-2-E"}  | ${FundamentalRotations.M}  | ${c(pieceIds.DF)}  | ${m({ B: F.D, D: F.F })}
	${"M-4-E"}  | ${FundamentalRotations.M}  | ${c(pieceIds.BD)}  | ${m({ U: F.B, B: F.D })}
	${"M-5-X"}  | ${FundamentalRotations.M}  | ${c(pieceIds.U)}   | ${m({ F: F.U })}
	${"M-6-X"}  | ${FundamentalRotations.M}  | ${c(pieceIds.F)}   | ${m({ D: F.F })}
	${"M-7-X"}  | ${FundamentalRotations.M}  | ${c(pieceIds.D)}   | ${m({ B: F.D })}
	${"M-8-X"}  | ${FundamentalRotations.M}  | ${c(pieceIds.B)}   | ${m({ U: F.B })}
	${"M-9-E"}  | ${FundamentalRotations.M_} | ${c(pieceIds.BU)}  | ${m({ B: F.U, D: F.B })}
	${"M-10-E"} | ${FundamentalRotations.M_} | ${c(pieceIds.FU)}  | ${m({ B: F.U, U: F.F })}
	${"M-11-E"} | ${FundamentalRotations.M_} | ${c(pieceIds.DF)}  | ${m({ U: F.F, F: F.D })}
	${"M-12-E"} | ${FundamentalRotations.M_} | ${c(pieceIds.BD)}  | ${m({ F: F.D, D: F.B })}
	${"M-13-X"} | ${FundamentalRotations.M_} | ${c(pieceIds.U)}   | ${m({ B: F.U })}
	${"M-14-X"} | ${FundamentalRotations.M_} | ${c(pieceIds.F)}   | ${m({ U: F.F })}
	${"M-15-X"} | ${FundamentalRotations.M_} | ${c(pieceIds.D)}   | ${m({ F: F.D })}
	${"M-16-X"} | ${FundamentalRotations.M_} | ${c(pieceIds.B)}   | ${m({ D: F.B })}
	${"S-1-E"}  | ${FundamentalRotations.S}  | ${c(pieceIds.LU)}  | ${m({ U: F.L, R: F.U })}
	${"S-2-E"}  | ${FundamentalRotations.S}  | ${c(pieceIds.RU)}  | ${m({ R: F.U, D: F.R })}
	${"S-3-E"}  | ${FundamentalRotations.S}  | ${c(pieceIds.DR)}  | ${m({ L: F.D, D: F.R })}
	${"S-4-E"}  | ${FundamentalRotations.S}  | ${c(pieceIds.DL)}  | ${m({ L: F.D, U: F.L })}
	${"S-5-X"}  | ${FundamentalRotations.S}  | ${c(pieceIds.U)}   | ${m({ R: F.U })}
	${"S-6-X"}  | ${FundamentalRotations.S}  | ${c(pieceIds.R)}   | ${m({ D: F.R })}
	${"S-7-X"}  | ${FundamentalRotations.S}  | ${c(pieceIds.D)}   | ${m({ L: F.D })}
	${"S-8-X"}  | ${FundamentalRotations.S}  | ${c(pieceIds.L)}   | ${m({ U: F.L })}
	${"S-9-E"}  | ${FundamentalRotations.S_} | ${c(pieceIds.LU)}  | ${m({ L: F.U, D: F.L })}
	${"S-10-E"} | ${FundamentalRotations.S_} | ${c(pieceIds.RU)}  | ${m({ L: F.U, U: F.R })}
	${"S-11-E"} | ${FundamentalRotations.S_} | ${c(pieceIds.DR)}  | ${m({ U: F.R, R: F.D })}
	${"S-12-E"} | ${FundamentalRotations.S_} | ${c(pieceIds.DL)}  | ${m({ R: F.D, D: F.L })}
	${"S-13-X"} | ${FundamentalRotations.S_} | ${c(pieceIds.U)}   | ${m({ L: F.U })}
	${"S-14-X"} | ${FundamentalRotations.S_} | ${c(pieceIds.R)}   | ${m({ U: F.R })}
	${"S-15-X"} | ${FundamentalRotations.S_} | ${c(pieceIds.D)}   | ${m({ R: F.D })}
	${"S-16-X"} | ${FundamentalRotations.S_} | ${c(pieceIds.L)}   | ${m({ D: F.L })}
	${"E-1-E"}  | ${FundamentalRotations.E}  | ${c(pieceIds.FL)}  | ${m({ F: F.L, R: F.F })}
	${"E-2-E"}  | ${FundamentalRotations.E}  | ${c(pieceIds.FR)}  | ${m({ B: F.R, R: F.F })}
	${"E-3-E"}  | ${FundamentalRotations.E}  | ${c(pieceIds.BR)}  | ${m({ L: F.B, B: F.R })}
	${"E-4-E"}  | ${FundamentalRotations.E}  | ${c(pieceIds.BL)}  | ${m({ L: F.B, F: F.L })}
	${"E-5-X"}  | ${FundamentalRotations.E}  | ${c(pieceIds.F)}   | ${m({ R: F.F })}
	${"E-6-X"}  | ${FundamentalRotations.E}  | ${c(pieceIds.R)}   | ${m({ B: F.R })}
	${"E-7-X"}  | ${FundamentalRotations.E}  | ${c(pieceIds.B)}   | ${m({ L: F.B })}
	${"E-8-X"}  | ${FundamentalRotations.E}  | ${c(pieceIds.L)}   | ${m({ F: F.L })}
	${"E-9-E"}  | ${FundamentalRotations.E_} | ${c(pieceIds.FL)}  | ${m({ B: F.L, L: F.F })}
	${"E-10-E"} | ${FundamentalRotations.E_} | ${c(pieceIds.FR)}  | ${m({ L: F.F, F: F.R })}
	${"E-11-E"} | ${FundamentalRotations.E_} | ${c(pieceIds.BR)}  | ${m({ F: F.R, R: F.B })}
	${"E-12-E"} | ${FundamentalRotations.E_} | ${c(pieceIds.BL)}  | ${m({ R: F.B, B: F.L })}
	${"E-13-X"} | ${FundamentalRotations.E_} | ${c(pieceIds.F)}   | ${m({ L: F.F })}
	${"E-14-X"} | ${FundamentalRotations.E_} | ${c(pieceIds.R)}   | ${m({ F: F.R })}
	${"E-15-X"} | ${FundamentalRotations.E_} | ${c(pieceIds.B)}   | ${m({ R: F.B })}
	${"E-16-X"} | ${FundamentalRotations.E_} | ${c(pieceIds.L)}   | ${m({ B: F.L })}
`(
	"$id: Rotation: $rotation | Scheme: $scheme",
	({
		rotation,
		scheme,
		expectedScheme,
	}: {
		rotation: FundamentalRotations;
		scheme: PieceScheme;
		expectedScheme: PieceScheme;
	}) => {
		const rotatedPiece = rotatePiece(rotation, {
			type: PieceType.CORNER,
			scheme,
		});

		expect(rotatedPiece.scheme).toEqual(expectedScheme);
	},
);
