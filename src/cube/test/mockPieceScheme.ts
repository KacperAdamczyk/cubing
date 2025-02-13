import type { PieceScheme } from "@/cube/types/PieceScheme";

export const mockPieceScheme = (scheme: Partial<PieceScheme>): PieceScheme => ({
  U: undefined,
  B: undefined,
  L: undefined,
  R: undefined,
  F: undefined,
  D: undefined,
  ...scheme,
});
