import { Colors, algorithmToFaces } from "@repo/cube";
import type { FC } from "react";
import { Face } from "@/components/Face";

interface Props {
  algorithm: string;
}

export const F2L: FC<Props> = ({ algorithm }) => {
  const faces = algorithmToFaces({
    algorithm,
    orientation: { U: Colors.Y, F: Colors.R },
  });

  return (
    <div className="relative aspect-square grid mr-[-33%] mt-[-33%]">
      <Face
        className="col-start-1 row-start-1 transform [--tw-skew-x:-45deg] [--tw-translate-x:25%] [--tw-translate-y:25%] [--tw-scale-y:0.5]"
        face={faces.U}
        maskedColors={[]}
      />
      <Face
        className="col-start-1 row-span-2"
        face={faces.F}
        maskedColors={[]}
      />
      <Face
        className="bottom-0 col-start-2 row-start-2 transform [--tw-skew-y:-45deg] [--tw-translate-y:-25%] [--tw-translate-x:-25%] [--tw-scale-x:0.5]"
        face={faces.R}
        maskedColors={[]}
      />
    </div>
  );
};
