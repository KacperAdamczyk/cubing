import { applyRotations } from "@/cube/compound/applyRotations";
import { isCubeSolved } from "@/cube/helpers/isCubeSolved";
import { createCube } from "@/cube/initializers/createCube";
import { Rotations } from "@/cube/types/Rotations";
import { expect, test } from "vitest";

test("correctly identifies a solved cube", () => {
  const cube = createCube();

  const isSolved = isCubeSolved(cube);

  expect(isSolved).toBe(true);
});

test("correctly identifies an unsolved cube", () => {
  const cube = applyRotations([Rotations.R], createCube());

  const isSolved = isCubeSolved(cube);

  expect(isSolved).toBe(false);
});
