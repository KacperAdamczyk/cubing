import { algorithmToFaces } from "@/compound/algorithmToFaces";
import { getAdjacentPieces } from "@/helpers/getAdjacentPieces";
import type { AdjacentPieces } from "@/types/AdjacentPieces";
import { Colors } from "@/types/Colors";
import { Faces } from "@/types/Faces";
import { expect, test } from "vitest";

const UPieces = {
	Top: [Colors.W, Colors.G, Colors.G],
	Right: [Colors.R, Colors.Y, Colors.B],
	Bottom: [Colors.O, Colors.G, Colors.Y],
	Left: [Colors.B, Colors.O, Colors.Y],
} satisfies AdjacentPieces<Colors>;

const RPieces = {
	Top: [Colors.W, Colors.G, Colors.G],
	Right: [Colors.Y, Colors.O, Colors.W],
	Bottom: [Colors.Y, Colors.W, Colors.O],
	Left: [Colors.R, Colors.Y, Colors.G],
} satisfies AdjacentPieces<Colors>;

const LPieces = {
	Top: [Colors.O, Colors.B, Colors.B],
	Right: [Colors.O, Colors.B, Colors.W],
	Bottom: [Colors.W, Colors.G, Colors.G],
	Left: [Colors.W, Colors.B, Colors.B],
} satisfies AdjacentPieces<Colors>;

const DPieces = {
	Top: [Colors.W, Colors.B, Colors.Y],
	Right: [Colors.O, Colors.Y, Colors.R],
	Bottom: [Colors.B, Colors.Y, Colors.G],
	Left: [Colors.O, Colors.R, Colors.R],
} satisfies AdjacentPieces<Colors>;

const FPieces = {
	Top: [Colors.O, Colors.Y, Colors.W],
	Right: [Colors.G, Colors.G, Colors.Y],
	Bottom: [Colors.B, Colors.B, Colors.G],
	Left: [Colors.B, Colors.O, Colors.W],
} satisfies AdjacentPieces<Colors>;

const BPieces = {
	Top: [Colors.G, Colors.G, Colors.R],
	Right: [Colors.B, Colors.W, Colors.G],
	Bottom: [Colors.O, Colors.W, Colors.W],
	Left: [Colors.O, Colors.Y, Colors.B],
} satisfies AdjacentPieces<Colors>;

test.each`
	scramble                                                       | face       | expected
	${"L B D2 R2 D' B R2 B' R F2 U2 L2 D2 B D2 B U2 B' D2 B2"}     | ${Faces.U} | ${UPieces}
	${"D2 L' F' B2 U' R2 L U' B R2 F R2 D2 F2 D2 B2 L2 D2 L'"}     | ${Faces.R} | ${RPieces}
	${"L B D2 R2 D' B R2 B' R F2 U2 L2 D2 B D2 B U2 B' D2 B2"}     | ${Faces.L} | ${LPieces}
	${"L B D2 R2 D' B R2 B' R F2 U2 L2 D2 B D2 B U2 B' D2 B2"}     | ${Faces.D} | ${DPieces}
	${"D B2 D F2 R2 D F2 D2 R2 F2 R2 U2 B' U' F L2 B' L' F' R B'"} | ${Faces.F} | ${FPieces}
	${"D2 L' F' B2 U' R2 L U' B R2 F R2 D2 F2 D2 B2 L2 D2 L'"}     | ${Faces.B} | ${BPieces}
`(
	"Returns correct adjacent pieces for: $face",
	({
		scramble,
		face,
		expected,
	}: {
		scramble: string;
		face: Faces;
		expected: AdjacentPieces<Colors>;
	}) => {
		const coloredFaces = algorithmToFaces({
			algorithm: scramble,
			orientation: {
				U: Colors.W,
				F: Colors.G,
			},
		});

		const adjacentPieces = getAdjacentPieces(coloredFaces, face);

		expect(adjacentPieces).toEqual(expected);
	},
);
