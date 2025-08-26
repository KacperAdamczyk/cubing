import type { ColorOrientation } from "@/cube/types/ColorOrientation";
import type { CubeState } from "@/cube/types/CubeState";

export interface Cube {
	orientation: ColorOrientation;
	state: CubeState;
}
