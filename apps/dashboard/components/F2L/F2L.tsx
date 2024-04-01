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
    <div className="relative aspect-square flex items-end">
      <Face
        className="absolute bottom-[65%] !h-[66%] !w-[66%] transform [--tw-skew-x:-45deg] [--tw-translate-x:25%] [--tw-translate-y:25%] [--tw-scale-y:0.5]"
        face={faces.U}
        maskedColors={[Colors.Y, Colors.B, Colors.O]}
      />
      <Face
        className="!h-[66%] !w-[66%]"
        face={faces.F}
        maskedColors={[Colors.Y, Colors.B, Colors.O]}
      />
      <Face
        className="absolute left-[65%] top-[34%] !h-[66%] !w-[66%] transform [--tw-skew-y:-45deg] [--tw-translate-y:-25%] [--tw-translate-x:-25%] [--tw-scale-x:0.5]"
        face={faces.R}
        maskedColors={[Colors.Y, Colors.B, Colors.O]}
      />
    </div>
  );
};
