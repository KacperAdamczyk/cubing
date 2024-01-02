import { Faces } from "@/types/Faces";
import { PieceScheme } from "@/types/PieceScheme";

export type CreatePieceSchemeConfig = Partial<
  Record<keyof typeof Faces, boolean>
>;

export const createPieceScheme = (
  config: CreatePieceSchemeConfig
): PieceScheme => ({
  U: config.U ? Faces.U : undefined,
  D: config.D ? Faces.D : undefined,
  F: config.F ? Faces.F : undefined,
  B: config.B ? Faces.B : undefined,
  L: config.L ? Faces.L : undefined,
  R: config.R ? Faces.R : undefined,
});
