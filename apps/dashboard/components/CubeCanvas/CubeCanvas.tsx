"use client";
import { type FC, type PropsWithChildren, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { CubeView } from "@/components/CubeView";
import { algorithmToFaces, Colors } from "@repo/cube";

const CubeCanvas: FC<PropsWithChildren> = ({ children }) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const faces = algorithmToFaces({
    algorithm: "R",
    orientation: { U: Colors.Y, F: Colors.R },
  });

  return (
    <div ref={divRef}>
      <CubeView faces={faces} />
      <Canvas eventSource={divRef}>
        <View.Port />
      </Canvas>
    </div>
  );
};

export default CubeCanvas;
