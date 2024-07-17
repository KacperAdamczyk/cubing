import { Tooltip } from "@nextui-org/tooltip";
import {
	applyRotations,
	createCube,
	isCubeSolved,
	rotationsFromString,
	toColoredFaceSlices,
} from "@repo/cube";
import { CaseViewTypes } from "@repo/db";
import type { FC } from "react";
import { MdErrorOutline } from "react-icons/md";
import { MdOutlineGppGood } from "react-icons/md";

interface Props {
	algorithm: string;
	setup: string;
	onlyError?: boolean;
	viewType: CaseViewTypes;
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
		if (viewType === CaseViewTypes.PLL) {
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
