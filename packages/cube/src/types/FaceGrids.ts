import type { FaceGrid } from "@/cube/types/FaceGrid";
import type { Face } from "@/cube/types/Face";

export type FaceGrids<Values> = Record<Face, FaceGrid<Values>>;
