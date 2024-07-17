import { Face } from "@/components/Face";
import {
	type ColorOrientation,
	Colors,
	Faces,
	algorithmToFaces,
	getAdjacentPieces,
} from "@repo/cube";
import type { FC } from "react";

interface Props {
	algorithm: string;
	maskedColors?: Colors[];
	orientation?: ColorOrientation;
}

export const LastLayer: FC<Props> = ({
	algorithm,
	maskedColors = [],
	orientation = { U: Colors.Y, F: Colors.G },
}) => {
	const faces = algorithmToFaces({
		algorithm,
		orientation,
	});
	const adjacentColors = getAdjacentPieces(faces, Faces.U);

	return (
		<Face
			face={faces.U}
			maskedColors={maskedColors}
			adjacentPieces={adjacentColors}
		/>
	);
};
