import { Rotations, isRotation } from "@/cube/types/Rotations";

const rotationsRegexp = /[UDFBLRudfblrMSExyz]2?'?/g;

export const rotationsFromString = (stringRotations: string): Rotations[] =>
  stringRotations.match(rotationsRegexp)?.filter(isRotation) ?? [];
