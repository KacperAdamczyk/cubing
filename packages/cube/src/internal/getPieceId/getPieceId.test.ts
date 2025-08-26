import { getPieceId } from "@/cube/internal/getPieceId";
import { mockPieceScheme } from "@/cube/test/mockPieceScheme";
import { Faces } from "@/cube/types/Faces";
import { expect, test } from "vitest";

test("returns the piece id", () => {
	const id = getPieceId(
		mockPieceScheme({
			U: Faces.R,
			R: Faces.U,
			B: Faces.F,
		}),
	);

	expect(id).toEqual({
		U: true,
		R: true,
		B: true,
	});
});
