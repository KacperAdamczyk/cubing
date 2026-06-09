import type { Stickers } from "@/cube/types/Stickers";

export const mockStickers = (stickers: Partial<Stickers>): Stickers => ({
	U: undefined,
	B: undefined,
	L: undefined,
	R: undefined,
	F: undefined,
	D: undefined,
	...stickers,
});
