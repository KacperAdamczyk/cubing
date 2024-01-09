import type { FaceSlice } from "@/types/FaceSlice";
import type { Faces } from "@/types/Faces";

export type FaceSlices<Values> = Record<Faces, FaceSlice<Values>>;
