import type { Colors } from "@/types/Colors";
import type { FaceSlice } from "@/types/FaceSlice";
import type { Faces } from "@/types/Faces";

export type FaceSlices<Values = Colors> = Record<Faces, FaceSlice<Values>>;
