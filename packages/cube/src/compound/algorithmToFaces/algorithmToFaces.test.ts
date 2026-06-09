import { expect, test } from "bun:test";
import { algorithmToFaces } from "@/cube/compound/algorithmToFaces";
import { Color } from "@/cube/types/Color";

const orientation = { U: Color.W, F: Color.G } as const;

test("an empty algorithm yields a solved cube with each face one color", () => {
	const faces = algorithmToFaces({ algorithm: "", orientation });

	expect(faces.U.flat().every((color) => color === Color.W)).toBe(true);
	expect(faces.D.flat().every((color) => color === Color.Y)).toBe(true);
	expect(faces.F.flat().every((color) => color === Color.G)).toBe(true);
	expect(faces.B.flat().every((color) => color === Color.B)).toBe(true);
	expect(faces.L.flat().every((color) => color === Color.O)).toBe(true);
	expect(faces.R.flat().every((color) => color === Color.R)).toBe(true);
});

test("a scramble conserves nine stickers of each of the six colors", () => {
	const faces = algorithmToFaces({
		algorithm: "R U R' U' F2 L D'",
		orientation,
	});

	const counts = new Map<Color, number>();
	for (const color of Object.values(faces).flat(2)) {
		counts.set(color, (counts.get(color) ?? 0) + 1);
	}

	expect(counts.size).toBe(6);
	expect([...counts.values()].every((count) => count === 9)).toBe(true);
});

test("the orientation chooses which color is on top", () => {
	const faces = algorithmToFaces({
		algorithm: "",
		orientation: { U: Color.Y, F: Color.G },
	});

	expect(faces.U.flat().every((color) => color === Color.Y)).toBe(true);
});
