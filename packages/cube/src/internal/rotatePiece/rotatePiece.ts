import { moveInScheme } from "@/cube/internal/moveInScheme";
import { Faces } from "@/cube/types/Faces";
import { type Piece } from "@/cube/types/Piece";
import { FundamentalRotations } from "@/cube/types/Rotations";
import { P, match } from "ts-pattern";

export const rotatePiece = (
	rotation: FundamentalRotations,
	piece: Piece,
): Piece => {
	const currentScheme = piece.scheme;

	const newScheme = match(rotation)
		.with(
			P.union(
				FundamentalRotations.U,
				FundamentalRotations.D_,
				FundamentalRotations.E_,
			),
			() =>
				moveInScheme(
					[
						[Faces.B, Faces.R],
						[Faces.R, Faces.F],
						[Faces.F, Faces.L],
						[Faces.L, Faces.B],
					],
					currentScheme,
				),
		)
		.with(
			P.union(
				FundamentalRotations.U_,
				FundamentalRotations.D,
				FundamentalRotations.E,
			),
			() =>
				moveInScheme(
					[
						[Faces.B, Faces.L],
						[Faces.L, Faces.F],
						[Faces.F, Faces.R],
						[Faces.R, Faces.B],
					],
					currentScheme,
				),
		)
		.with(
			P.union(
				FundamentalRotations.R,
				FundamentalRotations.L_,
				FundamentalRotations.M_,
			),
			() =>
				moveInScheme(
					[
						[Faces.U, Faces.B],
						[Faces.B, Faces.D],
						[Faces.D, Faces.F],
						[Faces.F, Faces.U],
					],
					currentScheme,
				),
		)
		.with(
			P.union(
				FundamentalRotations.R_,
				FundamentalRotations.L,
				FundamentalRotations.M,
			),
			() =>
				moveInScheme(
					[
						[Faces.U, Faces.F],
						[Faces.F, Faces.D],
						[Faces.D, Faces.B],
						[Faces.B, Faces.U],
					],
					currentScheme,
				),
		)
		.with(
			P.union(
				FundamentalRotations.F,
				FundamentalRotations.B_,
				FundamentalRotations.S,
			),
			() =>
				moveInScheme(
					[
						[Faces.U, Faces.R],
						[Faces.R, Faces.D],
						[Faces.D, Faces.L],
						[Faces.L, Faces.U],
					],
					currentScheme,
				),
		)
		.with(
			P.union(
				FundamentalRotations.F_,
				FundamentalRotations.B,
				FundamentalRotations.S_,
			),
			() =>
				moveInScheme(
					[
						[Faces.U, Faces.L],
						[Faces.L, Faces.D],
						[Faces.D, Faces.R],
						[Faces.R, Faces.U],
					],
					currentScheme,
				),
		)
		.exhaustive();

	return {
		...piece,
		scheme: newScheme,
	};
};
