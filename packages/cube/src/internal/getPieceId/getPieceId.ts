import { faceEntries } from "@/cube/helpers/faceEntries";
import type { Face } from "@/cube/types/Face";
import type { PieceId } from "@/cube/types/PieceId";
import type { Stickers } from "@/cube/types/Stickers";

export const getPieceId = (stickers: Stickers): PieceId =>
	Object.fromEntries(
		faceEntries(stickers)
			.filter((entry): entry is [Face, Face] => !!entry[1])
			.map(([face]) => [face, true] as const),
	);
