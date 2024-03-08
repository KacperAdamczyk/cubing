import { Face } from "@/components/Face";
import { Colors, algorithmToFaces } from "@repo/cube";
import type { FC } from "react";

interface Props {
  algorithm: string;
}

export const F2L: FC<Props> = ({ algorithm }) => {
  const faces = algorithmToFaces({
    algorithm,
    orientation: { U: Colors.Y, F: Colors.R },
  });

  return (
    <div className="aspect-square size-80 [perspective:800px]">
      <div className="relative size-full origin-center [transform-style:preserve-3d]">
        <Face
          className="absolute bottom-[25px] left-[25px] !size-[50%] [transform:rotateX(45deg)_rotateX(-90deg)_translateX(50%)_rotateX(90deg)]"
          face={faces.U}
          maskedColors={[]}
        />
        <Face
          className="absolute bottom-[25px] left-[25px] !size-[50%] [transform:translateZ(180px)]"
          face={faces.F}
          maskedColors={[]}
        />
        <Face
          className="absolute bottom-[25px] left-[25px] !size-[50%] [transform:rotateY(45deg)_translateZ(180px)]"
          face={faces.R}
          maskedColors={[]}
        />
      </div>
    </div>
  );
};
