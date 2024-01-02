import { Faces } from "@/types/Faces";

export type PieceScheme = Record<keyof typeof Faces, Faces | undefined>;
