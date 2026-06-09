import { expect, test } from "bun:test";
import { createCube } from "@/cube/factories/createCube";
import { Color } from "@/cube/types/Color";
import type { Cube } from "@/cube/types/Cube";

test("creates a cube", () => {
	const cube = createCube();

	expect(cube).toEqual({
		orientation: {
			U: Color.W,
			F: Color.G,
		},
		state: expect.any(Array),
	} satisfies Cube);
});
