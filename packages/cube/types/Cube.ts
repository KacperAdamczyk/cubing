import type { ColorOrientation } from "@/types/ColorOrientation";
import type { CubeState } from "@/types/CubeState";

export interface Cube {
  orientation: ColorOrientation;
  state: CubeState;
}
