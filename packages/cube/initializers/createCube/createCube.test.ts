import { createCube } from "@/initializers/createCube";
import { Colors } from "@/types/Colors";
import { Cube } from "@/types/Cube";
import { expect, test } from "vitest";

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
