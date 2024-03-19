import React, { type FC } from "react";
import { Colors, type FaceSlice, type FaceSlices } from "@repo/cube";
import { RoundedBox } from "@react-three/drei";

const gap = 0.01;

const colors = {
  [Colors.G]: "#009B48",
  [Colors.R]: "#B90000",
  [Colors.B]: "#0045AD",
  [Colors.O]: "#FF5900",
  [Colors.W]: "#FFFFFF",
  [Colors.Y]: "#FFD500",
  blank: "#808080",
} satisfies Record<Colors | "blank", string>;

const positions = [
  [-1 - gap, 1 + gap, 0],
  [0, 1 + gap, 0],
  [1 + gap, 1 + gap, 0],
  [-1 - gap, 0, 0],
  [0, 0, 0],
  [1 + gap, 0, 0],
  [-1 - gap, -1 - gap, 0],
  [0, -1 - gap, 0],
  [1 + gap, -1 - gap, 0],
] as const;

interface Props {
  face: FaceSlice<Colors>;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

const CubeFace: FC<Props> = ({ face, position, rotation }) => (
  <group position={position} rotation={rotation}>
    {positions.map((position, index) => {
      const pieceColor = face.flat().at(index);

      return (
        <RoundedBox
          key={index}
          args={[1, 1, 0.1]}
          position={position}
          material-color={pieceColor ? colors[pieceColor] : colors.blank}
        />
      );
    })}
  </group>
);

export default CubeFace;
