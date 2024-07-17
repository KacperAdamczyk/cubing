import { createCube } from "@/initializers/createCube";
import { Colors } from "@/types/Colors";
import type { Cube } from "@/types/Cube";
import { expect, test } from "vitest";

test("creates a cube", () => {
	const cube = createCube();

	expect(cube).toEqual({
		orientation: {
			U: Colors.W,
			F: Colors.G,
		},
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		state: expect.any(Array),
	} satisfies Cube);
});
