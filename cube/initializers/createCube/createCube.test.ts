import { createCube } from "@/cube/initializers/createCube";
import { Colors } from "@/cube/types/Colors";
import type { Cube } from "@/cube/types/Cube";
import { expect, test } from "vitest";

test("creates a cube", () => {
  const cube = createCube();

  expect(cube).toEqual({
    orientation: {
      U: Colors.W,
      F: Colors.G,
    },
    // eslint-disable-next-line @/cubetypescript-eslint/no-unsafe-assignment
    state: expect.any(Array),
  } satisfies Cube);
});
