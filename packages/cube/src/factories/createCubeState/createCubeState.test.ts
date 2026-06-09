import { expect, test } from "bun:test";
import { createCubeState } from "@/cube/factories/createCubeState";

test("creates a cube state", () => {
	const state = createCubeState();

	expect(state).toHaveLength(26);
});
