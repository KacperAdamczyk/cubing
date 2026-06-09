import { match } from "ts-pattern";
import type { ColorOrientation } from "@/cube/types/ColorOrientation";
import type { FaceColors } from "@/cube/types/FaceColors";
import { Color } from "@/cube/types/Color";

export const expandColors = (orientation: ColorOrientation): FaceColors => {
	return (
		match(orientation)
			.returnType<FaceColors>()
			// W
			.with({ U: Color.W, F: Color.G }, (base) => ({
				...base,
				R: Color.R,
				B: Color.B,
				L: Color.O,
				D: Color.Y,
			}))
			.with({ U: Color.W, F: Color.R }, (base) => ({
				...base,
				R: Color.B,
				B: Color.O,
				L: Color.G,
				D: Color.Y,
			}))
			.with({ U: Color.W, F: Color.B }, (base) => ({
				...base,
				R: Color.O,
				B: Color.G,
				L: Color.R,
				D: Color.Y,
			}))
			.with({ U: Color.W, F: Color.O }, (base) => ({
				...base,
				R: Color.G,
				B: Color.R,
				L: Color.B,
				D: Color.Y,
			}))
			// Y
			.with({ U: Color.Y, F: Color.G }, (base) => ({
				...base,
				R: Color.O,
				B: Color.B,
				L: Color.R,
				D: Color.W,
			}))
			.with({ U: Color.Y, F: Color.R }, (base) => ({
				...base,
				R: Color.G,
				B: Color.O,
				L: Color.B,
				D: Color.W,
			}))
			.with({ U: Color.Y, F: Color.B }, (base) => ({
				...base,
				R: Color.R,
				B: Color.G,
				L: Color.O,
				D: Color.W,
			}))
			.with({ U: Color.Y, F: Color.O }, (base) => ({
				...base,
				R: Color.B,
				B: Color.R,
				L: Color.G,
				D: Color.W,
			}))
			// G
			.with({ U: Color.G, F: Color.Y }, (base) => ({
				...base,
				R: Color.R,
				B: Color.W,
				L: Color.O,
				D: Color.B,
			}))
			.with({ U: Color.G, F: Color.W }, (base) => ({
				...base,
				R: Color.O,
				B: Color.Y,
				L: Color.R,
				D: Color.B,
			}))
			.with({ U: Color.G, F: Color.O }, (base) => ({
				...base,
				R: Color.Y,
				B: Color.R,
				L: Color.W,
				D: Color.B,
			}))
			.with({ U: Color.G, F: Color.R }, (base) => ({
				...base,
				R: Color.W,
				B: Color.O,
				L: Color.Y,
				D: Color.B,
			}))
			// B
			.with({ U: Color.B, F: Color.R }, (base) => ({
				...base,
				R: Color.Y,
				B: Color.O,
				L: Color.W,
				D: Color.G,
			}))
			.with({ U: Color.B, F: Color.O }, (base) => ({
				...base,
				R: Color.W,
				B: Color.R,
				L: Color.Y,
				D: Color.G,
			}))
			.with({ U: Color.B, F: Color.W }, (base) => ({
				...base,
				R: Color.R,
				B: Color.Y,
				L: Color.O,
				D: Color.G,
			}))
			.with({ U: Color.B, F: Color.Y }, (base) => ({
				...base,
				R: Color.O,
				B: Color.W,
				L: Color.R,
				D: Color.G,
			}))
			// R
			.with({ U: Color.R, F: Color.G }, (base) => ({
				...base,
				R: Color.Y,
				B: Color.B,
				L: Color.W,
				D: Color.O,
			}))
			.with({ U: Color.R, F: Color.B }, (base) => ({
				...base,
				R: Color.W,
				B: Color.G,
				L: Color.Y,
				D: Color.O,
			}))
			.with({ U: Color.R, F: Color.Y }, (base) => ({
				...base,
				R: Color.B,
				B: Color.W,
				L: Color.G,
				D: Color.O,
			}))
			.with({ U: Color.R, F: Color.W }, (base) => ({
				...base,
				R: Color.G,
				B: Color.Y,
				L: Color.B,
				D: Color.O,
			}))
			// O
			.with({ U: Color.O, F: Color.W }, (base) => ({
				...base,
				R: Color.B,
				B: Color.Y,
				L: Color.G,
				D: Color.R,
			}))
			.with({ U: Color.O, F: Color.Y }, (base) => ({
				...base,
				R: Color.G,
				B: Color.W,
				L: Color.B,
				D: Color.R,
			}))
			.with({ U: Color.O, F: Color.B }, (base) => ({
				...base,
				R: Color.Y,
				B: Color.G,
				L: Color.W,
				D: Color.R,
			}))
			.with({ U: Color.O, F: Color.G }, (base) => ({
				...base,
				R: Color.W,
				B: Color.B,
				L: Color.Y,
				D: Color.R,
			}))
			.exhaustive()
	);
};
