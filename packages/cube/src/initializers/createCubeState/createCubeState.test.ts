import { expect, test } from "vitest";
import { createCubeState } from "@/cube/initializers/createCubeState";

test("creates a cube state", () => {
	const state = createCubeState();

	expect(state).toHaveLength(26);
});
