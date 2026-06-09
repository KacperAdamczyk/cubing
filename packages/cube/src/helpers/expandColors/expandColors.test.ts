import { expect, test } from "bun:test";
import { expandColors } from "@/cube/helpers/expandColors";
import { Color } from "@/cube/types/Color";

test("expands colors", () => {
	const expandedColors = expandColors({
		U: Color.W,
		F: Color.G,
	});

	expect(expandedColors).toEqual({
		U: Color.W,
		F: Color.G,
		R: Color.R,
		B: Color.B,
		L: Color.O,
		D: Color.Y,
	});
});
