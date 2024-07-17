import { Faces } from "@/types/Faces";
import type { PieceId } from "@/types/PieceId";

export type PieceDescriptor =
	| `${Faces}`
	| `${Faces}${Faces}`
	| `${Faces}${Faces}${Faces}`;

export const pieceIds = {
	BLU: { B: true, L: true, U: true },
	BRU: { B: true, R: true, U: true },
	FLU: { F: true, L: true, U: true },
	FRU: { F: true, R: true, U: true },
	BDL: { B: true, D: true, L: true },
	BDR: { B: true, D: true, R: true },
	DFL: { D: true, F: true, L: true },
	DFR: { D: true, F: true, R: true },
	BU: { B: true, U: true },
	RU: { R: true, U: true },
	FU: { F: true, U: true },
	LU: { L: true, U: true },
	BL: { B: true, L: true },
	BR: { B: true, R: true },
	FL: { F: true, L: true },
	FR: { F: true, R: true },
	BD: { B: true, D: true },
	DR: { D: true, R: true },
	DF: { D: true, F: true },
	DL: { D: true, L: true },
	U: { U: true },
	D: { D: true },
	R: { R: true },
	L: { L: true },
	F: { F: true },
	B: { B: true },
} satisfies Partial<Record<PieceDescriptor, PieceId>>;
