import { createCubeState } from "@/initializers/createCubeState";
import { test, expect } from "vitest";

test("creates a cube state", () => {
  const state = createCubeState();

  expect(state).toHaveLength(26);
});
