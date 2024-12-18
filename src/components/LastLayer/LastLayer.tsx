import type { FC } from "react";

import { Face } from "@/components/Face";
import { Colors } from "@/cube/types/Colors";
import type { ColorOrientation } from "@/cube/types/ColorOrientation";
import { getAdjacentPieces } from "@/cube/helpers/getAdjacentPieces";
import { Faces } from "@/cube/types/Faces";
import { algorithmToFaces } from "@/cube/compound/algorithmToFaces";

interface Props {
  algorithm: string;
  maskedColors?: Colors[];
  orientation?: ColorOrientation;
}

export const LastLayer: FC<Props> = ({
  algorithm,
  maskedColors = [],
  orientation = { U: Colors.Y, F: Colors.G },
}) => {
  const faces = algorithmToFaces({
    algorithm,
    orientation,
  });
  const adjacentColors = getAdjacentPieces(faces, Faces.U);

  return (
    <Face
      face={faces.U}
      maskedColors={maskedColors}
      adjacentPieces={adjacentColors}
    />
  );
};
