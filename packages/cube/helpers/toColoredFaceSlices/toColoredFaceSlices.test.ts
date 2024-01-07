import { toColoredFaceSlices } from "@/helpers/toColoredFaceSlices";
import { createCube } from "@/initializers/createCube";
import { mockPieceScheme } from "@/test/mockPieceScheme";
import { Colors } from "@/types/Colors";
import type { FaceSlices } from "@/types/FaceSlices";
import { Faces } from "@/types/Faces";
import { expect, test } from "vitest";

test("returns colored faces", () => {
  const faces = toColoredFaceSlices({ U: Colors.W, F: Colors.G }, createCube());

  expect(faces).toEqual({
    U: [
      [Colors.W, Colors.W, Colors.W],
      [Colors.W, Colors.W, Colors.W],
      [Colors.W, Colors.W, Colors.W],
    ],
    F: [
      [Colors.G, Colors.G, Colors.G],
      [Colors.G, Colors.G, Colors.G],
      [Colors.G, Colors.G, Colors.G],
    ],
    R: [
      [Colors.R, Colors.R, Colors.R],
      [Colors.R, Colors.R, Colors.R],
      [Colors.R, Colors.R, Colors.R],
    ],
    D: [
      [Colors.Y, Colors.Y, Colors.Y],
      [Colors.Y, Colors.Y, Colors.Y],
      [Colors.Y, Colors.Y, Colors.Y],
    ],
    B: [
      [Colors.B, Colors.B, Colors.B],
      [Colors.B, Colors.B, Colors.B],
      [Colors.B, Colors.B, Colors.B],
    ],
    L: [
      [Colors.O, Colors.O, Colors.O],
      [Colors.O, Colors.O, Colors.O],
      [Colors.O, Colors.O, Colors.O],
    ],
  } satisfies FaceSlices<Colors>);
});

test("returns colored faces for a cube with two pieces swapped", () => {
  const cube = createCube();

  cube.state[0].scheme = mockPieceScheme({
    B: Faces.B,
    R: Faces.U,
    U: Faces.L,
  });
  cube.state[2].scheme = mockPieceScheme({
    B: Faces.B,
    U: Faces.R,
    L: Faces.U,
  });

  const faces = toColoredFaceSlices({ U: Colors.W, F: Colors.G }, cube);

  expect(faces).toEqual({
    U: [
      [Colors.R, Colors.W, Colors.O],
      [Colors.W, Colors.W, Colors.W],
      [Colors.W, Colors.W, Colors.W],
    ],
    F: [
      [Colors.G, Colors.G, Colors.G],
      [Colors.G, Colors.G, Colors.G],
      [Colors.G, Colors.G, Colors.G],
    ],
    R: [
      [Colors.R, Colors.R, Colors.W],
      [Colors.R, Colors.R, Colors.R],
      [Colors.R, Colors.R, Colors.R],
    ],
    D: [
      [Colors.Y, Colors.Y, Colors.Y],
      [Colors.Y, Colors.Y, Colors.Y],
      [Colors.Y, Colors.Y, Colors.Y],
    ],
    B: [
      [Colors.B, Colors.B, Colors.B],
      [Colors.B, Colors.B, Colors.B],
      [Colors.B, Colors.B, Colors.B],
    ],
    L: [
      [Colors.W, Colors.O, Colors.O],
      [Colors.O, Colors.O, Colors.O],
      [Colors.O, Colors.O, Colors.O],
    ],
  } satisfies FaceSlices<Colors>);
});
