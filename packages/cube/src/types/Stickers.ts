import type { Face } from "@/cube/types/Face";

export type Stickers<Value = Face> = Record<
	keyof typeof Face,
	Value | undefined
>;
