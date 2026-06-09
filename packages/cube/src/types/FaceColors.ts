import type { Color } from "@/cube/types/Color";

export type FaceColors =
	// W
	| {
			U: Color.W;
			F: Color.G;
			R: Color.R;
			B: Color.B;
			L: Color.O;
			D: Color.Y;
	  }
	| {
			U: Color.W;
			F: Color.O;
			R: Color.G;
			B: Color.R;
			L: Color.B;
			D: Color.Y;
	  }
	| {
			U: Color.W;
			F: Color.B;
			R: Color.O;
			B: Color.G;
			L: Color.R;
			D: Color.Y;
	  }
	| {
			U: Color.W;
			F: Color.R;
			R: Color.B;
			B: Color.O;
			L: Color.G;
			D: Color.Y;
	  }
	// Y
	| {
			U: Color.Y;
			F: Color.G;
			R: Color.O;
			B: Color.B;
			L: Color.R;
			D: Color.W;
	  }
	| {
			U: Color.Y;
			F: Color.O;
			R: Color.B;
			B: Color.R;
			L: Color.G;
			D: Color.W;
	  }
	| {
			U: Color.Y;
			F: Color.B;
			R: Color.R;
			B: Color.G;
			L: Color.O;
			D: Color.W;
	  }
	| {
			U: Color.Y;
			F: Color.R;
			R: Color.G;
			B: Color.O;
			L: Color.B;
			D: Color.W;
	  }
	// G
	| {
			U: Color.G;
			F: Color.W;
			R: Color.O;
			B: Color.Y;
			L: Color.R;
			D: Color.B;
	  }
	| {
			U: Color.G;
			F: Color.Y;
			R: Color.R;
			B: Color.W;
			L: Color.O;
			D: Color.B;
	  }
	| {
			U: Color.G;
			F: Color.O;
			R: Color.Y;
			B: Color.R;
			L: Color.W;
			D: Color.B;
	  }
	| {
			U: Color.G;
			F: Color.R;
			R: Color.W;
			B: Color.O;
			L: Color.Y;
			D: Color.B;
	  }
	// B
	| {
			U: Color.B;
			F: Color.W;
			R: Color.R;
			B: Color.Y;
			L: Color.O;
			D: Color.G;
	  }
	| {
			U: Color.B;
			F: Color.Y;
			R: Color.O;
			B: Color.W;
			L: Color.R;
			D: Color.G;
	  }
	| {
			U: Color.B;
			F: Color.O;
			R: Color.W;
			B: Color.R;
			L: Color.Y;
			D: Color.G;
	  }
	| {
			U: Color.B;
			F: Color.R;
			R: Color.Y;
			B: Color.O;
			L: Color.W;
			D: Color.G;
	  }
	// O
	| {
			U: Color.O;
			F: Color.W;
			R: Color.B;
			B: Color.Y;
			L: Color.G;
			D: Color.R;
	  }
	| {
			U: Color.O;
			F: Color.Y;
			R: Color.G;
			B: Color.W;
			L: Color.B;
			D: Color.R;
	  }
	| {
			U: Color.O;
			F: Color.G;
			R: Color.W;
			B: Color.B;
			L: Color.Y;
			D: Color.R;
	  }
	| {
			U: Color.O;
			F: Color.B;
			R: Color.Y;
			B: Color.G;
			L: Color.W;
			D: Color.R;
	  }
	// R
	| {
			U: Color.R;
			F: Color.W;
			R: Color.G;
			B: Color.Y;
			L: Color.B;
			D: Color.O;
	  }
	| {
			U: Color.R;
			F: Color.Y;
			R: Color.B;
			B: Color.W;
			L: Color.G;
			D: Color.O;
	  }
	| {
			U: Color.R;
			F: Color.B;
			R: Color.W;
			B: Color.G;
			L: Color.Y;
			D: Color.O;
	  }
	| {
			U: Color.R;
			F: Color.G;
			R: Color.Y;
			B: Color.B;
			L: Color.W;
			D: Color.O;
	  };
