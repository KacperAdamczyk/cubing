import { getPieceDescriptorForRotation } from "@/helpers/getPieceDescriptorForRotation/getPieceDescriptorForRotation";
import { rotatePiece } from "@/internal/rotatePiece";
import type { Cube } from "@/types/Cube";
import type { Faces } from "@/types/Faces";
import { FundamentalRotations } from "@/types/Rotations";
import { produce } from "immer";

export const rotateCube = (rotation: FundamentalRotations, cube: Cube): Cube =>
  produce(cube, (cubeDraft) => {
    for (const piece of cubeDraft.state) {
      const { faces, types } = getPieceDescriptorForRotation(rotation);

      const hasMatchingFace = (
        Object.entries(piece.scheme) as [Faces, Faces | undefined][]
      ).some(([face, value]) => value && faces.includes(face));

      if (!types.includes(piece.type) || !hasMatchingFace) {
        continue;
      }

      piece.scheme = rotatePiece(rotation, piece).scheme;
    }
  });
