import { applyRotations } from "@/cube/compound/applyRotations";
import { toColoredFaceSlices } from "@/cube/compound/toColoredFaceSlices";
import { isCubeSolved } from "@/cube/helpers/isCubeSolved";
import { rotationsFromString } from "@/cube/helpers/rotationsFromString";
import { createCube } from "@/cube/initializers/createCube";
import { Tooltip } from "@nextui-org/tooltip";
import type { FC } from "react";
import { MdErrorOutline } from "react-icons/md";
import { MdOutlineGppGood } from "react-icons/md";
import type { ViewType } from "src/content.config";

interface Props {
  algorithm: string;
  setup: string;
  onlyError?: boolean;
  viewType: ViewType;
}

export const AlgorithmVerifier: FC<Props> = ({
  algorithm,
  setup,
  onlyError = false,
  viewType,
}) => {
  const operations = rotationsFromString(`${setup} ${algorithm}`);
  const scrambledCube = applyRotations(operations, createCube());
  const isSolved = (() => {
    if (viewType === "PLL") {
      return isCubeSolved(scrambledCube);
    }

    const faces = toColoredFaceSlices(scrambledCube);
    const isTopLayerUniform = new Set(faces.U.flat()).size === 1;

    return isTopLayerUniform;
  })();

  const good = (
    <Tooltip content="Algorithm is good">
      <MdOutlineGppGood className="text-cube-green" />
    </Tooltip>
  );
  const bad = (
    <Tooltip content="Algorithm is bad">
      <MdErrorOutline className="text-cube-red" />
    </Tooltip>
  );

  if (onlyError) {
    return isSolved ? null : bad;
  }

  return isSolved ? good : bad;
};
