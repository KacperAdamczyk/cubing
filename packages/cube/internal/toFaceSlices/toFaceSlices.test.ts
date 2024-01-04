import { createCube } from "@/initializers/createCube";
import { toFaceSlices } from "@/internal/toFaceSlices";
import type { FaceSlices } from "@/types/FaceSlices";
import { Faces } from "@/types/Faces";
import { expect, test } from "vitest";

test("returns faces for a cube", () => {
  const faces = toFaceSlices(createCube());

  expect(faces).toEqual({
    U: [
      [Faces.U, Faces.U, Faces.U],
      [Faces.U, Faces.U, Faces.U],
      [Faces.U, Faces.U, Faces.U],
    ],
    F: [
      [Faces.F, Faces.F, Faces.F],
      [Faces.F, Faces.F, Faces.F],
      [Faces.F, Faces.F, Faces.F],
    ],
    R: [
      [Faces.R, Faces.R, Faces.R],
      [Faces.R, Faces.R, Faces.R],
      [Faces.R, Faces.R, Faces.R],
    ],
    D: [
      [Faces.D, Faces.D, Faces.D],
      [Faces.D, Faces.D, Faces.D],
      [Faces.D, Faces.D, Faces.D],
    ],
    B: [
      [Faces.B, Faces.B, Faces.B],
      [Faces.B, Faces.B, Faces.B],
      [Faces.B, Faces.B, Faces.B],
    ],
    L: [
      [Faces.L, Faces.L, Faces.L],
      [Faces.L, Faces.L, Faces.L],
      [Faces.L, Faces.L, Faces.L],
    ],
  } satisfies FaceSlices<Faces>);
});
