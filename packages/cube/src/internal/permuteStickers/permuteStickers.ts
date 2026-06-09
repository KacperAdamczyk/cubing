import { Face } from "@/cube/types/Face";
import type { Stickers } from "@/cube/types/Stickers";

export const permuteStickers = (
	swaps: [Face, Face][],
	stickers: Stickers,
): Stickers => {
	const swapMap = new Map([
		...swaps.map(([from]) => [from, undefined] as const),
		...swaps.map(([from, to]) => [to, from] as const),
	]);

	return {
		U: swapMap.has(Face.U) ? stickers[swapMap.get(Face.U)!] : stickers.U,
		D: swapMap.has(Face.D) ? stickers[swapMap.get(Face.D)!] : stickers.D,
		L: swapMap.has(Face.L) ? stickers[swapMap.get(Face.L)!] : stickers.L,
		R: swapMap.has(Face.R) ? stickers[swapMap.get(Face.R)!] : stickers.R,
		F: swapMap.has(Face.F) ? stickers[swapMap.get(Face.F)!] : stickers.F,
		B: swapMap.has(Face.B) ? stickers[swapMap.get(Face.B)!] : stickers.B,
	};
};
