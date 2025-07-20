import { stringifyPieceId } from "@/cube/helpers/stringifyPieceId/stringifyPieceId";
import type { PieceId } from "@/cube/types/PieceId";
import { expect, test } from "vitest";

test("stringifies a piece id", () => {
  const stringifiedPieceId = stringifyPieceId({
    U: true,
    F: true,
    R: true,
  } satisfies PieceId);

  expect(stringifiedPieceId).toEqual("FRU");
});
