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
  Top: [Colors.G, Colors.G, Colors.B],
  Right: [Colors.R, Colors.Y, Colors.B],
  Bottom: [Colors.G, Colors.Y, Colors.O],
  Left: [Colors.G, Colors.O, Colors.Y],
} satisfies AdjacentPieces<Colors>;

const LPieces = {
  Top: [Colors.G, Colors.G, Colors.O],
  Right: [Colors.B, Colors.Y, Colors.R],
  Bottom: [Colors.Y, Colors.O, Colors.G],
  Left: [Colors.Y, Colors.B, Colors.B],
} satisfies AdjacentPieces<Colors>;

const DPieces = {
  Top: [Colors.G, Colors.G, Colors.G],
  Right: [Colors.R, Colors.Y, Colors.B],
  Bottom: [Colors.O, Colors.O, Colors.O],
  Left: [Colors.B, Colors.Y, Colors.R],
} satisfies AdjacentPieces<Colors>;

const FPieces = {
  Top: [Colors.G, Colors.G, Colors.G],
  Right: [Colors.R, Colors.R, Colors.R],
  Bottom: [Colors.O, Colors.O, Colors.O],
  Left: [Colors.B, Colors.B, Colors.B],
} satisfies AdjacentPieces<Colors>;

const BPieces = {
  Top: [Colors.G, Colors.G, Colors.G],
  Right: [Colors.R, Colors.R, Colors.R],
  Bottom: [Colors.O, Colors.O, Colors.O],
  Left: [Colors.B, Colors.B, Colors.B],
} satisfies AdjacentPieces<Colors>;

test.each`
  scramble                                                   | face       | expected
  ${"L B D2 R2 D' B R2 B' R F2 U2 L2 D2 B D2 B U2 B' D2 B2"} | ${Faces.U} | ${UPieces}
  ${"L B D2 R2 D' B R2 B' R F2 U2 L2 D2 B D2 B U2 B' D2 B2"} | ${Faces.R} | ${RPieces}
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
