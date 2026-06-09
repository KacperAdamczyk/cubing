import { match, P } from "ts-pattern";
import { Face } from "@/cube/types/Face";
import { PieceType } from "@/cube/types/Piece";
import { FundamentalMove } from "@/cube/types/Move";

interface MoveScope {
	types: PieceType[];
	includeFaces: Face[];
	skipFaces?: Face[];
}

export const getMoveScope = (move: FundamentalMove): MoveScope =>
	match(move)
		.returnType<MoveScope>()
		.with(P.union(FundamentalMove.F, FundamentalMove.F_), () => ({
			types: [PieceType.CORNER, PieceType.EDGE],
			includeFaces: [Face.F],
		}))
		.with(P.union(FundamentalMove.B, FundamentalMove.B_), () => ({
			types: [PieceType.CORNER, PieceType.EDGE],
			includeFaces: [Face.B],
		}))
		.with(P.union(FundamentalMove.U, FundamentalMove.U_), () => ({
			types: [PieceType.CORNER, PieceType.EDGE],
			includeFaces: [Face.U],
		}))
		.with(P.union(FundamentalMove.D, FundamentalMove.D_), () => ({
			types: [PieceType.CORNER, PieceType.EDGE],
			includeFaces: [Face.D],
		}))
		.with(P.union(FundamentalMove.L, FundamentalMove.L_), () => ({
			types: [PieceType.CORNER, PieceType.EDGE],
			includeFaces: [Face.L],
		}))
		.with(P.union(FundamentalMove.R, FundamentalMove.R_), () => ({
			types: [PieceType.CORNER, PieceType.EDGE],
			includeFaces: [Face.R],
		}))
		.with(P.union(FundamentalMove.M, FundamentalMove.M_), () => ({
			types: [PieceType.EDGE, PieceType.CENTER],
			includeFaces: [Face.U, Face.D, Face.F, Face.B],
			skipFaces: [Face.R, Face.L],
		}))
		.with(P.union(FundamentalMove.E, FundamentalMove.E_), () => ({
			types: [PieceType.EDGE, PieceType.CENTER],
			includeFaces: [Face.F, Face.B, Face.L, Face.R],
			skipFaces: [Face.U, Face.D],
		}))
		.with(P.union(FundamentalMove.S, FundamentalMove.S_), () => ({
			types: [PieceType.EDGE, PieceType.CENTER],
			includeFaces: [Face.U, Face.D, Face.L, Face.R],
			skipFaces: [Face.F, Face.B],
		}))
		.exhaustive();
