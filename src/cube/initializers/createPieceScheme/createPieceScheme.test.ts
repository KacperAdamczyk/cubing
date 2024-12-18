import { createPieceScheme } from "@/cube/initializers/createPieceScheme";
import { Faces } from "@/cube/types/Faces";
import { expect, test } from "vitest";

test("creates a piece scheme", () => {
  const scheme = createPieceScheme({
    U: true,
    F: true,
    L: true,
  });

  expect(scheme).toEqual({
    U: Faces.U,
    F: Faces.F,
    L: Faces.L,
    R: undefined,
    D: undefined,
    B: undefined,
  });
});
