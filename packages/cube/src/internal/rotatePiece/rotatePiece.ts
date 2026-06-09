import { match, P } from "ts-pattern";
import { permuteStickers } from "@/cube/internal/permuteStickers";
import { Face } from "@/cube/types/Face";
import type { Piece } from "@/cube/types/Piece";
import { FundamentalMove } from "@/cube/types/Move";

export const rotatePiece = (move: FundamentalMove, piece: Piece): Piece => {
	const currentStickers = piece.stickers;

	const newStickers = match(move)
		.with(
			P.union(FundamentalMove.U, FundamentalMove.D_, FundamentalMove.E_),
			() =>
				permuteStickers(
					[
						[Face.B, Face.R],
						[Face.R, Face.F],
						[Face.F, Face.L],
						[Face.L, Face.B],
					],
					currentStickers,
				),
		)
		.with(
			P.union(FundamentalMove.U_, FundamentalMove.D, FundamentalMove.E),
			() =>
				permuteStickers(
					[
						[Face.B, Face.L],
						[Face.L, Face.F],
						[Face.F, Face.R],
						[Face.R, Face.B],
					],
					currentStickers,
				),
		)
		.with(
			P.union(FundamentalMove.R, FundamentalMove.L_, FundamentalMove.M_),
			() =>
				permuteStickers(
					[
						[Face.U, Face.B],
						[Face.B, Face.D],
						[Face.D, Face.F],
						[Face.F, Face.U],
					],
					currentStickers,
				),
		)
		.with(
			P.union(FundamentalMove.R_, FundamentalMove.L, FundamentalMove.M),
			() =>
				permuteStickers(
					[
						[Face.U, Face.F],
						[Face.F, Face.D],
						[Face.D, Face.B],
						[Face.B, Face.U],
					],
					currentStickers,
				),
		)
		.with(
			P.union(FundamentalMove.F, FundamentalMove.B_, FundamentalMove.S),
			() =>
				permuteStickers(
					[
						[Face.U, Face.R],
						[Face.R, Face.D],
						[Face.D, Face.L],
						[Face.L, Face.U],
					],
					currentStickers,
				),
		)
		.with(
			P.union(FundamentalMove.F_, FundamentalMove.B, FundamentalMove.S_),
			() =>
				permuteStickers(
					[
						[Face.U, Face.L],
						[Face.L, Face.D],
						[Face.D, Face.R],
						[Face.R, Face.U],
					],
					currentStickers,
				),
		)
		.exhaustive();

	return {
		...piece,
		stickers: newStickers,
	};
};
