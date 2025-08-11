import { Faces } from "@/cube/types/Faces";
import type { PieceId } from "@/cube/types/PieceId";
import type { PieceScheme } from "@/cube/types/PieceScheme";

export const createPieceScheme = (config: PieceId): PieceScheme => ({
  U: config.U ? Faces.U : undefined,
  D: config.D ? Faces.D : undefined,
  F: config.F ? Faces.F : undefined,
  B: config.B ? Faces.B : undefined,
  L: config.L ? Faces.L : undefined,
  R: config.R ? Faces.R : undefined,
});
