import { expect, test } from "bun:test";
import { faceEntries } from "@/cube/helpers/faceEntries";
import { Face } from "@/cube/types/Face";

test("returns entries keyed by Face", () => {
	const entries = faceEntries({ U: 1, D: 2, F: 3, B: 4, L: 5, R: 6 });

	expect(entries).toEqual([
		[Face.U, 1],
		[Face.D, 2],
		[Face.F, 3],
		[Face.B, 4],
		[Face.L, 5],
		[Face.R, 6],
	]);
});
