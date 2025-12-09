import type { PieceId } from "@/cube/types/PieceId";

export const stringifyPieceId = (pieceId: PieceId): string =>
	Object.keys(pieceId).toSorted().join("");
