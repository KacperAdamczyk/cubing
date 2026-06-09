import { expect, test } from "bun:test";
import { algorithmToFaces } from "@/cube/compound/algorithmToFaces";
import { getAdjacentPieces } from "@/cube/helpers/getAdjacentPieces";
import type { AdjacentPieces } from "@/cube/types/AdjacentPieces";
import { Color } from "@/cube/types/Color";
import { Face } from "@/cube/types/Face";

const UPieces = {
	Top: [Color.W, Color.G, Color.G],
	Right: [Color.R, Color.Y, Color.B],
	Bottom: [Color.O, Color.G, Color.Y],
	Left: [Color.B, Color.O, Color.Y],
} satisfies AdjacentPieces<Color>;

const RPieces = {
	Top: [Color.W, Color.G, Color.G],
	Right: [Color.Y, Color.O, Color.W],
	Bottom: [Color.Y, Color.W, Color.O],
	Left: [Color.R, Color.Y, Color.G],
} satisfies AdjacentPieces<Color>;

const LPieces = {
	Top: [Color.O, Color.B, Color.B],
	Right: [Color.O, Color.B, Color.W],
	Bottom: [Color.W, Color.G, Color.G],
	Left: [Color.W, Color.B, Color.B],
} satisfies AdjacentPieces<Color>;

const DPieces = {
	Top: [Color.W, Color.B, Color.Y],
	Right: [Color.O, Color.Y, Color.R],
	Bottom: [Color.B, Color.Y, Color.G],
	Left: [Color.O, Color.R, Color.R],
} satisfies AdjacentPieces<Color>;

const FPieces = {
	Top: [Color.O, Color.Y, Color.W],
	Right: [Color.G, Color.G, Color.Y],
	Bottom: [Color.B, Color.B, Color.G],
	Left: [Color.B, Color.O, Color.W],
} satisfies AdjacentPieces<Color>;

const BPieces = {
	Top: [Color.G, Color.G, Color.R],
	Right: [Color.B, Color.W, Color.G],
	Bottom: [Color.O, Color.W, Color.W],
	Left: [Color.O, Color.Y, Color.B],
} satisfies AdjacentPieces<Color>;

test.each([
	{
		scramble: "L B D2 R2 D' B R2 B' R F2 U2 L2 D2 B D2 B U2 B' D2 B2",
		face: Face.U,
		expected: UPieces,
	},
	{
		scramble: "D2 L' F' B2 U' R2 L U' B R2 F R2 D2 F2 D2 B2 L2 D2 L'",
		face: Face.R,
		expected: RPieces,
	},
	{
		scramble: "L B D2 R2 D' B R2 B' R F2 U2 L2 D2 B D2 B U2 B' D2 B2",
		face: Face.L,
		expected: LPieces,
	},
	{
		scramble: "L B D2 R2 D' B R2 B' R F2 U2 L2 D2 B D2 B U2 B' D2 B2",
		face: Face.D,
		expected: DPieces,
	},
	{
		scramble: "D B2 D F2 R2 D F2 D2 R2 F2 R2 U2 B' U' F L2 B' L' F' R B'",
		face: Face.F,
		expected: FPieces,
	},
	{
		scramble: "D2 L' F' B2 U' R2 L U' B R2 F R2 D2 F2 D2 B2 L2 D2 L'",
		face: Face.B,
		expected: BPieces,
	},
])("Returns correct adjacent pieces for: $face", ({
	scramble,
	face,
	expected,
}: {
	scramble: string;
	face: Face;
	expected: AdjacentPieces<Color>;
}) => {
	const coloredFaces = algorithmToFaces({
		algorithm: scramble,
		orientation: {
			U: Color.W,
			F: Color.G,
		},
	});

	const adjacentPieces = getAdjacentPieces(coloredFaces, face);

	expect(adjacentPieces).toEqual(expected);
});
