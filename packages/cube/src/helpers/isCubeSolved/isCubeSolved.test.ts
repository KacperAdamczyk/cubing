import { expect, test } from "bun:test";
import { applyMoves } from "@/cube/compound/applyMoves";
import { isCubeSolved } from "@/cube/helpers/isCubeSolved";
import { createCube } from "@/cube/factories/createCube";
import { Move } from "@/cube/types/Move";

test("correctly identifies a solved cube", () => {
	const cube = createCube();

	const isSolved = isCubeSolved(cube);

	expect(isSolved).toBe(true);
});

test("correctly identifies an unsolved cube", () => {
	const cube = applyMoves([Move.R], createCube());

	const isSolved = isCubeSolved(cube);

	expect(isSolved).toBe(false);
});
