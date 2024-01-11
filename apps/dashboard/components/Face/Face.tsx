import { cn } from "@nextui-org/react";
import {
  Colors,
  type AdjacentPieces,
  type FaceSlice,
  type Faces,
} from "@repo/cube";
import type { FC, ReactNode } from "react";

interface Props {
  face: FaceSlice<Colors>;
  maskedColors: Colors[];
  adjacentPieces: AdjacentPieces<Faces.U, Colors>;
}

interface PieceProps {
  color?: Colors;
  className?: string;
}

const Piece: FC<PieceProps> = ({ color, className }) => (
  <div
    className={cn(className, "bg-cube-blank rounded", {
      "bg-cube-green": color === Colors.G,
      "bg-cube-red": color === Colors.R,
      "bg-cube-blue": color === Colors.B,
      "bg-cube-orange": color === Colors.O,
      "bg-cube-yellow": color === Colors.Y,
      "bg-cube-white": color === Colors.W,
    })}
  />
);

export const Face: FC<Props> = ({ face, maskedColors, adjacentPieces }) => {
  const maskedColorsSet = new Set(maskedColors);
  const maskColor = (color: Colors): Colors | undefined =>
    maskedColorsSet.has(color) ? undefined : color;
  const pieces = face.flat().map(maskColor);

  return (
    <div className="grid-cols-cube grid-rows-cube grid aspect-square h-full min-h-20 w-full min-w-20 gap-[2%]">
      <Piece
        className="col-start-2 row-start-1"
        color={maskColor(adjacentPieces.B[0])}
      />
      <Piece
        className="col-start-3 row-start-1"
        color={maskColor(adjacentPieces.B[1])}
      />
      <Piece
        className="col-start-4 row-start-1"
        color={maskColor(adjacentPieces.B[2])}
      />

      <Piece
        className="col-start-1 row-start-2"
        color={maskColor(adjacentPieces.L[0])}
      />
      <Piece className="col-start-2 row-start-2" color={pieces[0]} />
      <Piece className="col-start-3 row-start-2" color={pieces[1]} />
      <Piece className="col-start-4 row-start-2" color={pieces[2]} />
      <Piece
        className="col-start-5 row-start-2"
        color={maskColor(adjacentPieces.R[2])}
      />

      <Piece
        className="col-start-1 row-start-3"
        color={maskColor(adjacentPieces.L[1])}
      />
      <Piece className="col-start-2 row-start-3" color={pieces[3]} />
      <Piece className="col-start-3 row-start-3" color={pieces[4]} />
      <Piece className="col-start-4 row-start-3" color={pieces[5]} />
      <Piece
        className="col-start-5 row-start-3"
        color={maskColor(adjacentPieces.R[1])}
      />

      <Piece
        className="col-start-1 row-start-4"
        color={maskColor(adjacentPieces.L[2])}
      />
      <Piece className="col-start-2 row-start-4" color={pieces[6]} />
      <Piece className="col-start-3 row-start-4" color={pieces[7]} />
      <Piece className="col-start-4 row-start-4" color={pieces[8]} />
      <Piece
        className="col-start-5 row-start-4"
        color={maskColor(adjacentPieces.R[0])}
      />

      <Piece
        className="col-start-2 row-start-5"
        color={maskColor(adjacentPieces.F[0])}
      />
      <Piece
        className="col-start-3 row-start-5"
        color={maskColor(adjacentPieces.F[1])}
      />
      <Piece
        className="col-start-4 row-start-5"
        color={maskColor(adjacentPieces.F[2])}
      />
    </div>
  );
};
