import { moveInScheme } from "@/internal/moveInScheme";
import { mockPieceScheme } from "@/test/mockPieceScheme";
import { Faces } from "@/types/Faces";
import { expect, test } from "vitest";

test("moves to an empty slot", () => {
  const scheme = moveInScheme(
    [[Faces.U, Faces.R]],
    mockPieceScheme({
      U: Faces.U,
      L: Faces.L,
      B: Faces.B,
    })
  );

  expect(scheme).toEqual(
    mockPieceScheme({
      R: Faces.U,
      L: Faces.L,
      B: Faces.B,
    })
  );
});

test("swaps to a non-empty slot", () => {
  const scheme = moveInScheme(
    [[Faces.U, Faces.L]],
    mockPieceScheme({
      U: Faces.U,
      L: Faces.L,
      B: Faces.B,
    })
  );

  expect(scheme).toEqual(
    mockPieceScheme({
      L: Faces.U,
      B: Faces.B,
    })
  );
});

test("swaps items", () => {
  const scheme = moveInScheme(
    [
      [Faces.U, Faces.L],
      [Faces.L, Faces.U],
    ],
    mockPieceScheme({
      U: Faces.U,
      L: Faces.L,
      B: Faces.B,
    })
  );

  expect(scheme).toEqual(
    mockPieceScheme({
      U: Faces.L,
      L: Faces.U,
      B: Faces.B,
    })
  );
});
