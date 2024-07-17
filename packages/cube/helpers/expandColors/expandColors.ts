import type { ColorOrientation } from "@/types/ColorOrientation";
import type { ColorScheme } from "@/types/ColorScheme";
import { Colors } from "@/types/Colors";
import { match } from "ts-pattern";

export const expandColors = (orientation: ColorOrientation): ColorScheme => {
	return (
		match(orientation)
			.returnType<ColorScheme>()
			// W
			.with({ U: Colors.W, F: Colors.G }, (base) => ({
				...base,
				R: Colors.R,
				B: Colors.B,
				L: Colors.O,
				D: Colors.Y,
			}))
			.with({ U: Colors.W, F: Colors.R }, (base) => ({
				...base,
				R: Colors.B,
				B: Colors.O,
				L: Colors.G,
				D: Colors.Y,
			}))
			.with({ U: Colors.W, F: Colors.B }, (base) => ({
				...base,
				R: Colors.O,
				B: Colors.G,
				L: Colors.R,
				D: Colors.Y,
			}))
			.with({ U: Colors.W, F: Colors.O }, (base) => ({
				...base,
				R: Colors.G,
				B: Colors.R,
				L: Colors.B,
				D: Colors.Y,
			}))
			// Y
			.with({ U: Colors.Y, F: Colors.G }, (base) => ({
				...base,
				R: Colors.O,
				B: Colors.B,
				L: Colors.R,
				D: Colors.W,
			}))
			.with({ U: Colors.Y, F: Colors.R }, (base) => ({
				...base,
				R: Colors.G,
				B: Colors.O,
				L: Colors.B,
				D: Colors.W,
			}))
			.with({ U: Colors.Y, F: Colors.B }, (base) => ({
				...base,
				R: Colors.R,
				B: Colors.G,
				L: Colors.O,
				D: Colors.W,
			}))
			.with({ U: Colors.Y, F: Colors.O }, (base) => ({
				...base,
				R: Colors.B,
				B: Colors.R,
				L: Colors.G,
				D: Colors.W,
			}))
			// G
			.with({ U: Colors.G, F: Colors.Y }, (base) => ({
				...base,
				R: Colors.R,
				B: Colors.W,
				L: Colors.O,
				D: Colors.B,
			}))
			.with({ U: Colors.G, F: Colors.W }, (base) => ({
				...base,
				R: Colors.O,
				B: Colors.Y,
				L: Colors.R,
				D: Colors.B,
			}))
			.with({ U: Colors.G, F: Colors.O }, (base) => ({
				...base,
				R: Colors.Y,
				B: Colors.R,
				L: Colors.W,
				D: Colors.B,
			}))
			.with({ U: Colors.G, F: Colors.R }, (base) => ({
				...base,
				R: Colors.W,
				B: Colors.O,
				L: Colors.Y,
				D: Colors.B,
			}))
			// B
			.with({ U: Colors.B, F: Colors.R }, (base) => ({
				...base,
				R: Colors.Y,
				B: Colors.O,
				L: Colors.W,
				D: Colors.G,
			}))
			.with({ U: Colors.B, F: Colors.O }, (base) => ({
				...base,
				R: Colors.W,
				B: Colors.R,
				L: Colors.Y,
				D: Colors.G,
			}))
			.with({ U: Colors.B, F: Colors.W }, (base) => ({
				...base,
				R: Colors.R,
				B: Colors.Y,
				L: Colors.O,
				D: Colors.G,
			}))
			.with({ U: Colors.B, F: Colors.Y }, (base) => ({
				...base,
				R: Colors.O,
				B: Colors.W,
				L: Colors.R,
				D: Colors.G,
			}))
			// R
			.with({ U: Colors.R, F: Colors.G }, (base) => ({
				...base,
				R: Colors.Y,
				B: Colors.B,
				L: Colors.W,
				D: Colors.O,
			}))
			.with({ U: Colors.R, F: Colors.B }, (base) => ({
				...base,
				R: Colors.W,
				B: Colors.G,
				L: Colors.Y,
				D: Colors.O,
			}))
			.with({ U: Colors.R, F: Colors.Y }, (base) => ({
				...base,
				R: Colors.B,
				B: Colors.W,
				L: Colors.G,
				D: Colors.O,
			}))
			.with({ U: Colors.R, F: Colors.W }, (base) => ({
				...base,
				R: Colors.G,
				B: Colors.Y,
				L: Colors.B,
				D: Colors.O,
			}))
			// O
			.with({ U: Colors.O, F: Colors.W }, (base) => ({
				...base,
				R: Colors.B,
				B: Colors.Y,
				L: Colors.G,
				D: Colors.R,
			}))
			.with({ U: Colors.O, F: Colors.Y }, (base) => ({
				...base,
				R: Colors.G,
				B: Colors.W,
				L: Colors.B,
				D: Colors.R,
			}))
			.with({ U: Colors.O, F: Colors.B }, (base) => ({
				...base,
				R: Colors.Y,
				B: Colors.G,
				L: Colors.W,
				D: Colors.R,
			}))
			.with({ U: Colors.O, F: Colors.G }, (base) => ({
				...base,
				R: Colors.W,
				B: Colors.B,
				L: Colors.Y,
				D: Colors.R,
			}))
			.exhaustive()
	);
};
