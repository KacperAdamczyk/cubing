import { createCubeState } from "@/initializers/createCubeState";
import type { ColorOrientation } from "@/types/ColorOrientation";
import { Colors } from "@/types/Colors";
import type { Cube } from "@/types/Cube";

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
