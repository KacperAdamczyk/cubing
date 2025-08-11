import { createCubeState } from "@/cube/initializers/createCubeState";
import type { ColorOrientation } from "@/cube/types/ColorOrientation";
import { Colors } from "@/cube/types/Colors";
import type { Cube } from "@/cube/types/Cube";

const defaultColorOrientation = {
  U: Colors.W,
  F: Colors.G,
} satisfies ColorOrientation;

export interface CreateCubeOptions {
  orientation?: ColorOrientation;
}

export const createCube = ({
  orientation = defaultColorOrientation,
}: CreateCubeOptions = {}): Cube => {
  return {
    orientation,
    state: createCubeState(),
  };
};
