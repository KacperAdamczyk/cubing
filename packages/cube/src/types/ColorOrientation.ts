import type { Color } from "@/cube/types/Color";

export type ColorOrientation =
	// Y
	| { U: Color.Y; F: Color.B }
	| { U: Color.Y; F: Color.G }
	| { U: Color.Y; F: Color.O }
	| { U: Color.Y; F: Color.R }
	// W
	| { U: Color.W; F: Color.B }
	| { U: Color.W; F: Color.G }
	| { U: Color.W; F: Color.O }
	| { U: Color.W; F: Color.R }
	// G
	| { U: Color.G; F: Color.O }
	| { U: Color.G; F: Color.R }
	| { U: Color.G; F: Color.W }
	| { U: Color.G; F: Color.Y }
	// B
	| { U: Color.B; F: Color.Y }
	| { U: Color.B; F: Color.O }
	| { U: Color.B; F: Color.W }
	| { U: Color.B; F: Color.R }
	// O
	| { U: Color.O; F: Color.G }
	| { U: Color.O; F: Color.W }
	| { U: Color.O; F: Color.B }
	| { U: Color.O; F: Color.Y }
	// R
	| { U: Color.R; F: Color.G }
	| { U: Color.R; F: Color.Y }
	| { U: Color.R; F: Color.B }
	| { U: Color.R; F: Color.W };
