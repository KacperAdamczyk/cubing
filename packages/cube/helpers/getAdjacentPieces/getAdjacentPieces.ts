import type { AdjacentPieces } from "@/types/AdjacentPieces";
import type { FaceSlices } from "@/types/FaceSlices";
import { Faces } from "@/types/Faces";
import { match } from "ts-pattern";

export const getAdjacentPieces = <Value>(
  faces: FaceSlices<Value>,
  upFace: Faces,
): AdjacentPieces<Value> => {
  return match(upFace)
    .returnType<AdjacentPieces<Value>>()
    .with(Faces.U, () => ({
      Bottom: faces[Faces.F][0],
      Right: [faces[Faces.R][0][2], faces[Faces.R][0][1], faces[Faces.R][0][0]],
      Top: [faces[Faces.B][0][2], faces[Faces.B][0][1], faces[Faces.B][0][0]],
      Left: faces[Faces.L][0],
    }))
    .with(Faces.D, () => ({
      Bottom: [
        faces[Faces.B][2][2],
        faces[Faces.B][2][1],
        faces[Faces.B][2][0],
      ],
      Left: [faces[Faces.L][2][2], faces[Faces.L][2][1], faces[Faces.L][2][0]],
      Top: faces[Faces.F][2],
      Right: faces[Faces.R][2],
    }))
    .with(Faces.F, () => ({
      Top: faces[Faces.U][2],
      Right: [faces[Faces.R][0][0], faces[Faces.R][1][0], faces[Faces.R][2][0]],
      Bottom: faces[Faces.D][0],
      Left: [faces[Faces.L][0][2], faces[Faces.L][1][2], faces[Faces.L][2][2]],
    }))
    .with(Faces.B, () => ({
      Bottom: [
        faces[Faces.D][2][2],
        faces[Faces.D][2][1],
        faces[Faces.D][2][0],
      ],
      Right: [faces[Faces.L][0][0], faces[Faces.L][1][0], faces[Faces.L][2][0]],
      Top: [faces[Faces.U][0][2], faces[Faces.U][0][1], faces[Faces.U][0][0]],
      Left: [faces[Faces.R][0][2], faces[Faces.R][1][2], faces[Faces.R][2][2]],
    }))
    .with(Faces.R, () => ({
      Top: [faces[Faces.U][2][2], faces[Faces.U][1][2], faces[Faces.U][0][2]],
      Left: [faces[Faces.F][0][2], faces[Faces.F][1][2], faces[Faces.F][2][2]],
      Bottom: [
        faces[Faces.D][0][2],
        faces[Faces.D][1][2],
        faces[Faces.D][2][2],
      ],
      Right: [faces[Faces.B][0][0], faces[Faces.B][1][0], faces[Faces.B][2][0]],
    }))
    .with(Faces.L, () => ({
      Top: [faces[Faces.U][0][0], faces[Faces.U][1][0], faces[Faces.U][2][0]],
      Right: [faces[Faces.F][0][0], faces[Faces.F][1][0], faces[Faces.F][2][0]],
      Bottom: [
        faces[Faces.D][2][0],
        faces[Faces.D][1][0],
        faces[Faces.D][0][0],
      ],
      Left: [faces[Faces.B][0][2], faces[Faces.B][1][2], faces[Faces.B][2][2]],
    }))
    .exhaustive();
};
