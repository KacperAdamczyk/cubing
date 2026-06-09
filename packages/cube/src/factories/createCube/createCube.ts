import { createCubeState } from "@/cube/factories/createCubeState";
import type { ColorOrientation } from "@/cube/types/ColorOrientation";
import { Color } from "@/cube/types/Color";
import type { Cube } from "@/cube/types/Cube";

const defaultColorOrientation = {
	U: Color.W,
	F: Color.G,
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
