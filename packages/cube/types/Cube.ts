import { ColorOrientation } from "@/types/ColorOrientation";
import { CubeState } from "@/types/CubeState";

export interface Cube {
  orientation: ColorOrientation;
  state: CubeState;
}
