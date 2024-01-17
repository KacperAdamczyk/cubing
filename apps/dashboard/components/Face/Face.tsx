import { cn } from "@nextui-org/react";
import {
  Colors,
  type AdjacentPieces,
  type FaceSlice,
  type Faces,
} from "@repo/cube";
import type { FC } from "react";

interface Props {
  className?: string;
  face: FaceSlice<Colors>;
  maskedColors: (Colors | undefined)[];
  maskedAdjPieces?: Partial<AdjacentPieces<true | undefined>>;
  adjacentPieces: AdjacentPieces<Colors>;
  faceLabel?: Faces;
}

const blankColor = "X";

interface PieceProps {
  color?: Colors | typeof blankColor;
  className?: string;
}

const Piece: FC<PieceProps> = ({ color, className }) => (
  <div
    className={cn(className, "rounded", {
      "bg-cube-blank": color === blankColor,
      "bg-cube-green": color === Colors.G,
      "bg-cube-red": color === Colors.R,
      "bg-cube-blue": color === Colors.B,
      "bg-cube-orange": color === Colors.O,
      "bg-cube-yellow": color === Colors.Y,
      "bg-cube-white": color === Colors.W,
    })}
  />
);

export const Face: FC<Props> = ({
  className,
  face,
  maskedColors,
  maskedAdjPieces,
  adjacentPieces,
  faceLabel,
}) => {
  const maskedColorsSet = new Set(maskedColors);
  const maskColor = (
    color: Colors,
    hidden?: true,
  ): Colors | typeof blankColor | undefined => {
    if (hidden) {
      return;
    }

    return maskedColorsSet.has(color) ? blankColor : color;
  };
  const pieces = face.flat().map((piece) => maskColor(piece));

  return (
    <div
      className={cn(
        className,
        "grid-cols-cube grid-rows-cube grid aspect-square h-full min-h-20 w-full min-w-20 gap-[2%]",
      )}
    >
      <Piece
        className="col-start-2 row-start-1"
        color={maskColor(adjacentPieces.Top[0], maskedAdjPieces?.Top?.[0])}
      />
      <Piece
        className="col-start-3 row-start-1"
        color={maskColor(adjacentPieces.Top[1], maskedAdjPieces?.Top?.[1])}
      />
      <Piece
        className="col-start-4 row-start-1"
        color={maskColor(adjacentPieces.Top[2], maskedAdjPieces?.Top?.[2])}
      />

      <Piece
        className="col-start-1 row-start-2"
        color={maskColor(adjacentPieces.Left[0], maskedAdjPieces?.Left?.[0])}
      />
      <Piece className="col-start-2 row-start-2" color={pieces[0]} />
      <Piece className="col-start-3 row-start-2" color={pieces[1]} />
      <Piece className="col-start-4 row-start-2" color={pieces[2]} />
      <Piece
        className="col-start-5 row-start-2"
        color={maskColor(adjacentPieces.Right[0], maskedAdjPieces?.Right?.[0])}
      />

      <Piece
        className="col-start-1 row-start-3"
        color={maskColor(adjacentPieces.Left[1], maskedAdjPieces?.Left?.[1])}
      />
      <Piece className="col-start-2 row-start-3" color={pieces[3]} />
      <Piece className="col-start-3 row-start-3" color={pieces[4]} />
      {!!faceLabel && (
        <div className="text-default-400 relative col-start-3 row-start-3 flex select-none items-center justify-center text-2xl font-bold">
          {faceLabel}
        </div>
      )}
      <Piece className="col-start-4 row-start-3" color={pieces[5]} />
      <Piece
        className="col-start-5 row-start-3"
        color={maskColor(adjacentPieces.Right[1], maskedAdjPieces?.Right?.[1])}
      />

      <Piece
        className="col-start-1 row-start-4"
        color={maskColor(adjacentPieces.Left[2], maskedAdjPieces?.Left?.[2])}
      />
      <Piece className="col-start-2 row-start-4" color={pieces[6]} />
      <Piece className="col-start-3 row-start-4" color={pieces[7]} />
      <Piece className="col-start-4 row-start-4" color={pieces[8]} />
      <Piece
        className="col-start-5 row-start-4"
        color={maskColor(adjacentPieces.Right[2], maskedAdjPieces?.Right?.[2])}
      />

      <Piece
        className="col-start-2 row-start-5"
        color={maskColor(
          adjacentPieces.Bottom[0],
          maskedAdjPieces?.Bottom?.[0],
        )}
      />
      <Piece
        className="col-start-3 row-start-5"
        color={maskColor(
          adjacentPieces.Bottom[1],
          maskedAdjPieces?.Bottom?.[1],
        )}
      />
      <Piece
        className="col-start-4 row-start-5"
        color={maskColor(
          adjacentPieces.Bottom[2],
          maskedAdjPieces?.Bottom?.[2],
        )}
      />
    </div>
  );
};
