import { expect, test } from "bun:test";
import { applyMoves } from "@/cube/compound/applyMoves";
import { createCube } from "@/cube/factories/createCube";
import { isCubeSolved } from "@/cube/helpers/isCubeSolved";
import { Move } from "@/cube/types/Move";

test("a move followed by its inverse leaves the cube solved", () => {
	expect(isCubeSolved(applyMoves([Move.R, Move.R_], createCube()))).toBe(true);
});

test("the sexy move (R U R' U') has order 6", () => {
	const sexy = [Move.R, Move.U, Move.R_, Move.U_];
	const moves = Array.from({ length: 6 }, () => sexy).flat();

	expect(isCubeSolved(applyMoves(moves, createCube()))).toBe(true);
});

test("a single quarter turn does not leave the cube solved", () => {
	expect(isCubeSolved(applyMoves([Move.R], createCube()))).toBe(false);
});
