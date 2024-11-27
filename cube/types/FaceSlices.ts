import type { FaceSlice } from "@/cube/types/FaceSlice";
import type { Faces } from "@/cube/types/Faces";

export type FaceSlices<Values> = Record<Faces, FaceSlice<Values>>;
