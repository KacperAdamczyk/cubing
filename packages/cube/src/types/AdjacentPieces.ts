import type { Triple } from "@/cube/types/Triple";

export enum Side {
	Top = "Top",
	Bottom = "Bottom",
	Left = "Left",
	Right = "Right",
}

export type AdjacentPieces<Value> = Record<Side, Triple<Value>>;
