import { match, P } from "ts-pattern";
import { Faces } from "@/cube/types/Faces";
import { PieceType } from "@/cube/types/Piece";
import { FundamentalRotations } from "@/cube/types/Rotations";

interface GetPieceDescriptorForRotation {
	types: PieceType[];
	includeFaces: Faces[];
	skipFaces?: Faces[];
}

export const getPieceDescriptorForRotation = (
	rotation: FundamentalRotations,
): GetPieceDescriptorForRotation =>
	match(rotation)
		.returnType<GetPieceDescriptorForRotation>()
		.with(P.union(FundamentalRotations.F, FundamentalRotations.F_), () => ({
			types: [PieceType.CORNER, PieceType.EDGE],
			includeFaces: [Faces.F],
		}))
		.with(P.union(FundamentalRotations.B, FundamentalRotations.B_), () => ({
			types: [PieceType.CORNER, PieceType.EDGE],
			includeFaces: [Faces.B],
		}))
		.with(P.union(FundamentalRotations.U, FundamentalRotations.U_), () => ({
			types: [PieceType.CORNER, PieceType.EDGE],
			includeFaces: [Faces.U],
		}))
		.with(P.union(FundamentalRotations.D, FundamentalRotations.D_), () => ({
			types: [PieceType.CORNER, PieceType.EDGE],
			includeFaces: [Faces.D],
		}))
		.with(P.union(FundamentalRotations.L, FundamentalRotations.L_), () => ({
			types: [PieceType.CORNER, PieceType.EDGE],
			includeFaces: [Faces.L],
		}))
		.with(P.union(FundamentalRotations.R, FundamentalRotations.R_), () => ({
			types: [PieceType.CORNER, PieceType.EDGE],
			includeFaces: [Faces.R],
		}))
		.with(P.union(FundamentalRotations.M, FundamentalRotations.M_), () => ({
			types: [PieceType.EDGE, PieceType.CENTER],
			includeFaces: [Faces.U, Faces.D, Faces.F, Faces.B],
			skipFaces: [Faces.R, Faces.L],
		}))
		.with(P.union(FundamentalRotations.E, FundamentalRotations.E_), () => ({
			types: [PieceType.EDGE, PieceType.CENTER],
			includeFaces: [Faces.F, Faces.B, Faces.L, Faces.R],
			skipFaces: [Faces.U, Faces.D],
		}))
		.with(P.union(FundamentalRotations.S, FundamentalRotations.S_), () => ({
			types: [PieceType.EDGE, PieceType.CENTER],
			includeFaces: [Faces.U, Faces.D, Faces.L, Faces.R],
			skipFaces: [Faces.F, Faces.B],
		}))
		.exhaustive();
