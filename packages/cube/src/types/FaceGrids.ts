import type { Face } from "@/cube/types/Face";
import type { FaceGrid } from "@/cube/types/FaceGrid";

export type FaceGrids<Values> = Record<Face, FaceGrid<Values>>;
