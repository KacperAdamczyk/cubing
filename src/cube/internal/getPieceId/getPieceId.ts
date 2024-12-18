import { Faces } from "@/cube/types/Faces";
import type { PieceId } from "@/cube/types/PieceId";
import type { PieceScheme } from "@/cube/types/PieceScheme";

export const getPieceId = (scheme: PieceScheme): PieceId =>
  Object.fromEntries(
    (Object.entries(scheme) as [Faces, Faces | undefined][])
      .filter((schemePart): schemePart is [Faces, Faces] => !!schemePart.at(1))
      .map(([face]) => [face, true] as const),
  );
