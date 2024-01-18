import { Face } from "@/components/Face";
import { Colors, Faces, algorithmToFaces, getAdjacentPieces } from "@repo/cube";
import type { FC } from "react";

interface Props {
  algorithm: string;
}

export const CubeMesh: FC<Props> = ({ algorithm }) => {
  const faces = algorithmToFaces({
    algorithm,
    orientation: { U: Colors.W, F: Colors.G },
  });
  const adjB = getAdjacentPieces(faces, Faces.B);
  const adjU = getAdjacentPieces(faces, Faces.U);
  const adjF = getAdjacentPieces(faces, Faces.F);
  const adjL = getAdjacentPieces(faces, Faces.L);
  const adjR = getAdjacentPieces(faces, Faces.R);
  const adjD = getAdjacentPieces(faces, Faces.D);

  return (
    <div className="grid aspect-[4/3] w-full">
      <Face
        className="col-start-2 row-start-1"
        face={faces.U}
        adjacentPieces={adjU}
        maskedColors={[]}
        faceLabel={Faces.U}
        maskedAdjPieces={{
          Bottom: [true, true, true],
        }}
      />
      <Face
        className="col-start-1 row-start-2"
        face={faces.L}
        adjacentPieces={adjL}
        maskedColors={[]}
        faceLabel={Faces.L}
        maskedAdjPieces={{
          Right: [true, true, true],
        }}
      />
      <Face
        className="col-start-2 row-start-2"
        face={faces.F}
        adjacentPieces={adjF}
        maskedColors={[]}
        faceLabel={Faces.F}
        maskedAdjPieces={{
          Top: [true, true, true],
          Left: [true, true, true],
          Right: [true, true, true],
          Bottom: [true, true, true],
        }}
      />
      <Face
        className="col-start-3 row-start-2"
        face={faces.R}
        adjacentPieces={adjR}
        maskedColors={[]}
        faceLabel={Faces.R}
        maskedAdjPieces={{
          Left: [true, true, true],
          Right: [true, true, true],
        }}
      />
      <Face
        className="col-start-4 row-start-2"
        face={faces.B}
        adjacentPieces={adjB}
        maskedColors={[]}
        faceLabel={Faces.B}
        maskedAdjPieces={{
          Left: [true, true, true],
        }}
      />
      <Face
        className="col-start-2 row-start-3"
        face={faces.D}
        adjacentPieces={adjD}
        maskedColors={[]}
        faceLabel={Faces.D}
        maskedAdjPieces={{
          Top: [true, true, true],
        }}
      />
    </div>
  );
};
