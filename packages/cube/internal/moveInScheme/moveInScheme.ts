/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Faces } from "@/types/Faces";
import type { PieceScheme } from "@/types/PieceScheme";

export const moveInScheme = (
  swaps: [Faces, Faces][],
  scheme: PieceScheme,
): PieceScheme => {
  const swapMap = new Map([
    ...swaps.map(([from]) => [from, undefined] as const),
    ...swaps.map(([from, to]) => [to, from] as const),
  ]);

  return {
    U: swapMap.has(Faces.U) ? scheme[swapMap.get(Faces.U)!] : scheme.U,
    D: swapMap.has(Faces.D) ? scheme[swapMap.get(Faces.D)!] : scheme.D,
    L: swapMap.has(Faces.L) ? scheme[swapMap.get(Faces.L)!] : scheme.L,
    R: swapMap.has(Faces.R) ? scheme[swapMap.get(Faces.R)!] : scheme.R,
    F: swapMap.has(Faces.F) ? scheme[swapMap.get(Faces.F)!] : scheme.F,
    B: swapMap.has(Faces.B) ? scheme[swapMap.get(Faces.B)!] : scheme.B,
  };
};
