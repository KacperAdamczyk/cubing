import { Faces } from "@/types/Faces";
import type { PieceId } from "@/types/PieceId";
import type { PieceScheme } from "@/types/PieceScheme";

export const getPieceId = (scheme: PieceScheme): PieceId =>
	Object.fromEntries(
		(Object.entries(scheme) as [Faces, Faces | undefined][])
			.filter((schemePart): schemePart is [Faces, Faces] => !!schemePart.at(1))
			.map(([face]) => [face, true] as const),
	);
