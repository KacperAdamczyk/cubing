import { Tooltip } from "@nextui-org/tooltip";
import {
  applyRotations,
  createCube,
  isCubeSolved,
  rotationsFromString,
} from "@repo/cube";
import type { FC } from "react";
import { MdErrorOutline } from "react-icons/md";
import { MdOutlineGppGood } from "react-icons/md";

interface Props {
  algorithm: string;
  setup: string;
  onlyError?: boolean;
}

export const AlgorithmVerifier: FC<Props> = ({
  algorithm,
  setup,
  onlyError = false,
}) => {
  const operations = rotationsFromString(`${setup} ${algorithm}`);
  const scrambledCube = applyRotations(operations, createCube());
  const isSolved = isCubeSolved(scrambledCube);

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
