import { Faces } from "@/types/Faces";

export type PieceScheme<Value = Faces> = Record<
	keyof typeof Faces,
	Value | undefined
>;
