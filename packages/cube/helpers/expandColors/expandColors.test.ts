import { expandColors } from "@/helpers/expandColors";
import { Colors } from "@/types/Colors";
import { expect, test } from "vitest";

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
