import { match } from "ts-pattern";
import type { AdjacentPieces } from "@/cube/types/AdjacentPieces";
import type { FaceGrids } from "@/cube/types/FaceGrids";
import { Face } from "@/cube/types/Face";

export const getAdjacentPieces = <Value>(
	faces: FaceGrids<Value>,
	upFace: Face,
): AdjacentPieces<Value> => {
	return match(upFace)
		.returnType<AdjacentPieces<Value>>()
		.with(Face.U, () => ({
			Bottom: faces[Face.F][0],
			Right: [faces[Face.R][0][2], faces[Face.R][0][1], faces[Face.R][0][0]],
			Top: [faces[Face.B][0][2], faces[Face.B][0][1], faces[Face.B][0][0]],
			Left: faces[Face.L][0],
		}))
		.with(Face.D, () => ({
			Bottom: [faces[Face.B][2][2], faces[Face.B][2][1], faces[Face.B][2][0]],
			Left: [faces[Face.L][2][2], faces[Face.L][2][1], faces[Face.L][2][0]],
			Top: faces[Face.F][2],
			Right: faces[Face.R][2],
		}))
		.with(Face.F, () => ({
			Top: faces[Face.U][2],
			Right: [faces[Face.R][0][0], faces[Face.R][1][0], faces[Face.R][2][0]],
			Bottom: faces[Face.D][0],
			Left: [faces[Face.L][0][2], faces[Face.L][1][2], faces[Face.L][2][2]],
		}))
		.with(Face.B, () => ({
			Bottom: [faces[Face.D][2][2], faces[Face.D][2][1], faces[Face.D][2][0]],
			Right: [faces[Face.L][0][0], faces[Face.L][1][0], faces[Face.L][2][0]],
			Top: [faces[Face.U][0][2], faces[Face.U][0][1], faces[Face.U][0][0]],
			Left: [faces[Face.R][0][2], faces[Face.R][1][2], faces[Face.R][2][2]],
		}))
		.with(Face.R, () => ({
			Top: [faces[Face.U][2][2], faces[Face.U][1][2], faces[Face.U][0][2]],
			Left: [faces[Face.F][0][2], faces[Face.F][1][2], faces[Face.F][2][2]],
			Bottom: [faces[Face.D][0][2], faces[Face.D][1][2], faces[Face.D][2][2]],
			Right: [faces[Face.B][0][0], faces[Face.B][1][0], faces[Face.B][2][0]],
		}))
		.with(Face.L, () => ({
			Top: [faces[Face.U][0][0], faces[Face.U][1][0], faces[Face.U][2][0]],
			Right: [faces[Face.F][0][0], faces[Face.F][1][0], faces[Face.F][2][0]],
			Bottom: [faces[Face.D][2][0], faces[Face.D][1][0], faces[Face.D][0][0]],
			Left: [faces[Face.B][0][2], faces[Face.B][1][2], faces[Face.B][2][2]],
		}))
		.exhaustive();
};
