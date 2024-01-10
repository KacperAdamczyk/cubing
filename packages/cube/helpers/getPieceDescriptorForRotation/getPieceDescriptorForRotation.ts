import { Faces } from "@/types/Faces";
import { PieceType } from "@/types/Piece";
import { FundamentalRotations } from "@/types/Rotations";
import { P, match } from "ts-pattern";

interface GetPieceDescriptorForRotation {
  faces: Faces[];
  types: PieceType[];
}

export const getPieceDescriptorForRotation = (
  rotation: FundamentalRotations,
): GetPieceDescriptorForRotation =>
  match(rotation)
    .returnType<GetPieceDescriptorForRotation>()
    .with(P.union(FundamentalRotations.F, FundamentalRotations.F_), () => ({
      faces: [Faces.F],
      types: [PieceType.CORNER, PieceType.EDGE],
    }))
    .with(P.union(FundamentalRotations.B, FundamentalRotations.B_), () => ({
      faces: [Faces.B],
      types: [PieceType.CORNER, PieceType.EDGE],
    }))
    .with(P.union(FundamentalRotations.U, FundamentalRotations.U_), () => ({
      faces: [Faces.U],
      types: [PieceType.CORNER, PieceType.EDGE],
    }))
    .with(P.union(FundamentalRotations.D, FundamentalRotations.D_), () => ({
      faces: [Faces.D],
      types: [PieceType.CORNER, PieceType.EDGE],
    }))
    .with(P.union(FundamentalRotations.L, FundamentalRotations.L_), () => ({
      faces: [Faces.L],
      types: [PieceType.CORNER, PieceType.EDGE],
    }))
    .with(P.union(FundamentalRotations.R, FundamentalRotations.R_), () => ({
      faces: [Faces.R],
      types: [PieceType.CORNER, PieceType.EDGE],
    }))
    .with(P.union(FundamentalRotations.M, FundamentalRotations.M_), () => ({
      faces: [Faces.U, Faces.D, Faces.F, Faces.B],
      types: [PieceType.EDGE],
    }))
    .with(P.union(FundamentalRotations.E, FundamentalRotations.E_), () => ({
      faces: [Faces.F, Faces.B, Faces.L, Faces.R],
      types: [PieceType.EDGE],
    }))
    .with(P.union(FundamentalRotations.S, FundamentalRotations.S_), () => ({
      faces: [Faces.U, Faces.D, Faces.L, Faces.R],
      types: [PieceType.EDGE],
    }))
    .exhaustive();
