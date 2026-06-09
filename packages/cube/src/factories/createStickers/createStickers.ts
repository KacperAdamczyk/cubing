import { Face } from "@/cube/types/Face";
import type { PieceId } from "@/cube/types/PieceId";
import type { Stickers } from "@/cube/types/Stickers";

export const createStickers = (config: PieceId): Stickers => ({
	U: config.U ? Face.U : undefined,
	D: config.D ? Face.D : undefined,
	F: config.F ? Face.F : undefined,
	B: config.B ? Face.B : undefined,
	L: config.L ? Face.L : undefined,
	R: config.R ? Face.R : undefined,
});
