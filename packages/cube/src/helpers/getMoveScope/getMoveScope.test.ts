import { expect, test } from "bun:test";
import { getMoveScope } from "@/cube/helpers/getMoveScope/getMoveScope";
import { Face } from "@/cube/types/Face";
import { FundamentalMove } from "@/cube/types/Move";
import { PieceType } from "@/cube/types/Piece";

test("a face turn affects the corners and edges on that face", () => {
	expect(getMoveScope(FundamentalMove.R)).toEqual({
		types: [PieceType.CORNER, PieceType.EDGE],
		includeFaces: [Face.R],
	});
});

test("a slice move affects edges and centers and skips the parallel faces", () => {
	expect(getMoveScope(FundamentalMove.M)).toEqual({
		types: [PieceType.EDGE, PieceType.CENTER],
		includeFaces: [Face.U, Face.D, Face.F, Face.B],
		skipFaces: [Face.R, Face.L],
	});
});

test("a turn and its inverse share the same scope", () => {
	expect(getMoveScope(FundamentalMove.U_)).toEqual(
		getMoveScope(FundamentalMove.U),
	);
});
