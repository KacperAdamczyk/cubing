import type { PieceId } from "@/types/PieceId";

export const stringifyPieceId = (pieceId: PieceId): string =>
  Object.keys(pieceId).toSorted().join("");
