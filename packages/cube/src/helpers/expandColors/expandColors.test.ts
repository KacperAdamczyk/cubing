import { expect, test } from "vitest";
import { expandColors } from "@/cube/helpers/expandColors";
import { Colors } from "@/cube/types/Colors";

test("expands colors", () => {
	const expandedColors = expandColors({
		U: Colors.W,
		F: Colors.G,
	});

	expect(expandedColors).toEqual({
		U: Colors.W,
		F: Colors.G,
		R: Colors.R,
		B: Colors.B,
		L: Colors.O,
		D: Colors.Y,
	});
});
