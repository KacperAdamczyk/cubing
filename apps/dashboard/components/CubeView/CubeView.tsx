"use client";
import React, { type FC } from "react";
import { ArcballControls, Box, Stage, View } from "@react-three/drei";
import { Colors, type FaceSlices } from "@repo/cube";
import CubeFace from "@/components/CubeView/CubeFace/CubeFace";

interface Props {
  faces: FaceSlices<Colors>;
}

export const CubeView: FC<Props> = ({ faces }) => {
  return (
    <View>
      <Stage adjustCamera={1.5}>
        <Box args={[3, 3, 3]} position={[0, 0, 0]} material-color="gray" />
        <CubeFace
          face={faces.U}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 1.5, 0]}
        />
        <CubeFace
          face={faces.D}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, -1.5, 0]}
        />
        <CubeFace face={faces.F} position={[0, 0, 1.5]} />
        <CubeFace face={faces.B} position={[0, 0, -1.5]} />
        <CubeFace
          face={faces.R}
          rotation={[0, Math.PI / 2, 0]}
          position={[1.5, 0, 0]}
        />
        <CubeFace
          face={faces.L}
          rotation={[0, -Math.PI / 2, 0]}
          position={[-1.5, 0, 0]}
        />
      </Stage>
      <ArcballControls enableRotate />
    </View>
  );
};
