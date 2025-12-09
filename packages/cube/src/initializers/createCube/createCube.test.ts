import { expect, test } from "vitest";
import { createCube } from "@/cube/initializers/createCube";
import { Colors } from "@/cube/types/Colors";
import type { Cube } from "@/cube/types/Cube";

test("creates a cube", () => {
	const cube = createCube();

	expect(cube).toEqual({
		orientation: {
			U: Colors.W,
			F: Colors.G,
		},
		state: expect.any(Array),
	} satisfies Cube);
});
