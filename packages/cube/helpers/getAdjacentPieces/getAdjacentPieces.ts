import type { AdjacentPieces } from "@/types/AdjacentPieces";
import type { FaceSlices } from "@/types/FaceSlices";
import { Faces } from "@/types/Faces";

export const getAdjacentPieces = <Face extends Faces, Value>(
  faces: FaceSlices<Value>,
  upFace: Face
): AdjacentPieces<Face, Value> => {
  if (upFace === Faces.U) {
    return {
      face: Faces.U,
      F: faces[Faces.F][0],
      R: faces[Faces.R][0],
      B: faces[Faces.B][2],
      L: faces[Faces.L][0],
    } as AdjacentPieces<Face, Value>;
  }

  if (upFace === Faces.D) {
    return {
      face: Faces.D,
      F: faces[Faces.F][2],
      R: faces[Faces.R][2],
      B: faces[Faces.B][0],
      L: faces[Faces.L][2],
    } as AdjacentPieces<Face, Value>;
  }

  if (upFace === Faces.F) {
    return {
      face: Faces.F,
      U: faces[Faces.U][2],
      R: [faces[Faces.R][0][0], faces[Faces.R][1][0], faces[Faces.R][2][0]],
      D: faces[Faces.D][2],
      L: [faces[Faces.L][0][2], faces[Faces.L][1][2], faces[Faces.L][2][2]],
    } as AdjacentPieces<Face, Value>;
  }

  if (upFace === Faces.B) {
    return {
      face: Faces.B,
      U: faces[Faces.U][0],
      R: [faces[Faces.R][0][2], faces[Faces.R][1][2], faces[Faces.R][2][2]],
      D: faces[Faces.D][0],
      L: [faces[Faces.L][0][0], faces[Faces.L][1][0], faces[Faces.L][2][0]],
    } as AdjacentPieces<Face, Value>;
  }

  if (upFace === Faces.R) {
    return {
      face: Faces.R,
      U: [faces[Faces.U][0][2], faces[Faces.U][1][2], faces[Faces.U][2][2]],
      F: [faces[Faces.F][0][2], faces[Faces.F][1][2], faces[Faces.F][2][2]],
      D: [faces[Faces.D][0][0], faces[Faces.D][1][0], faces[Faces.D][2][0]],
      B: [faces[Faces.B][0][2], faces[Faces.B][1][2], faces[Faces.B][2][2]],
    } as AdjacentPieces<Face, Value>;
  }

  if (upFace === Faces.L) {
    return {
      face: Faces.L,
      U: [faces[Faces.U][0][0], faces[Faces.U][1][0], faces[Faces.U][2][0]],
      F: [faces[Faces.F][0][0], faces[Faces.F][1][0], faces[Faces.F][2][0]],
      D: [faces[Faces.D][0][2], faces[Faces.D][1][2], faces[Faces.D][2][2]],
      B: [faces[Faces.B][0][0], faces[Faces.B][1][0], faces[Faces.B][2][0]],
    } as AdjacentPieces<Face, Value>;
  }

  throw new Error("Invalid face");
};
