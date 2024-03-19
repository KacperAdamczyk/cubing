import type { FC } from "react";
import {
  Colors,
  algorithmToFaces,
  type ColorOrientation,
  getAdjacentPieces,
  Faces,
} from "@repo/cube";
import { Face } from "@/components/Face";
import { CubeView } from "@/components/CubeView";

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
