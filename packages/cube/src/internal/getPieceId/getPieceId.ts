import type { Face } from "@/cube/types/Face";
import type { PieceId } from "@/cube/types/PieceId";
import type { Stickers } from "@/cube/types/Stickers";

export const getPieceId = (stickers: Stickers): PieceId =>
	Object.fromEntries(
		(Object.entries(stickers) as [Face, Face | undefined][])
			.filter((schemePart): schemePart is [Face, Face] => !!schemePart.at(1))
			.map(([face]) => [face, true] as const),
	);
