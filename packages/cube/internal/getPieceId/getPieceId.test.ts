import { getPieceId } from "@/internal/getPieceId";
import { mockPieceScheme } from "@/test/mockPieceScheme";
import { Faces } from "@/types/Faces";
import { expect, test } from "vitest";

test("returns the piece id", () => {
  const id = getPieceId(
    mockPieceScheme({
      U: Faces.R,
      R: Faces.U,
      B: Faces.F,
    }),
  );

  expect(id).toEqual({
    U: true,
    R: true,
    B: true,
  });
});
