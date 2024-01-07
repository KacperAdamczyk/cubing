import type { Colors } from "@/types/Colors";

export type ColorScheme =
  // W
  | {
      U: Colors.W;
      F: Colors.G;
      R: Colors.R;
      B: Colors.B;
      L: Colors.O;
      D: Colors.Y;
    }
  | {
      U: Colors.W;
      F: Colors.O;
      R: Colors.G;
      B: Colors.R;
      L: Colors.B;
      D: Colors.Y;
    }
  | {
      U: Colors.W;
      F: Colors.B;
      R: Colors.O;
      B: Colors.G;
      L: Colors.R;
      D: Colors.Y;
    }
  | {
      U: Colors.W;
      F: Colors.R;
      R: Colors.B;
      B: Colors.O;
      L: Colors.G;
      D: Colors.Y;
    }
  // Y
  | {
      U: Colors.Y;
      F: Colors.G;
      R: Colors.O;
      B: Colors.B;
      L: Colors.R;
      D: Colors.W;
    }
  | {
      U: Colors.Y;
      F: Colors.O;
      R: Colors.B;
      B: Colors.R;
      L: Colors.G;
      D: Colors.W;
    }
  | {
      U: Colors.Y;
      F: Colors.B;
      R: Colors.R;
      B: Colors.G;
      L: Colors.O;
      D: Colors.W;
    }
  | {
      U: Colors.Y;
      F: Colors.R;
      R: Colors.G;
      B: Colors.O;
      L: Colors.B;
      D: Colors.W;
    }
  // G
  | {
      U: Colors.G;
      F: Colors.W;
      R: Colors.O;
      B: Colors.Y;
      L: Colors.R;
      D: Colors.B;
    }
  | {
      U: Colors.G;
      F: Colors.Y;
      R: Colors.R;
      B: Colors.W;
      L: Colors.O;
      D: Colors.B;
    }
  | {
      U: Colors.G;
      F: Colors.O;
      R: Colors.Y;
      B: Colors.R;
      L: Colors.W;
      D: Colors.B;
    }
  | {
      U: Colors.G;
      F: Colors.R;
      R: Colors.W;
      B: Colors.O;
      L: Colors.Y;
      D: Colors.B;
    }
  // B
  | {
      U: Colors.B;
      F: Colors.W;
      R: Colors.R;
      B: Colors.Y;
      L: Colors.O;
      D: Colors.G;
    }
  | {
      U: Colors.B;
      F: Colors.Y;
      R: Colors.O;
      B: Colors.W;
      L: Colors.R;
      D: Colors.G;
    }
  | {
      U: Colors.B;
      F: Colors.O;
      R: Colors.W;
      B: Colors.R;
      L: Colors.Y;
      D: Colors.G;
    }
  | {
      U: Colors.B;
      F: Colors.R;
      R: Colors.Y;
      B: Colors.O;
      L: Colors.W;
      D: Colors.G;
    }
  // O
  | {
      U: Colors.O;
      F: Colors.W;
      R: Colors.B;
      B: Colors.Y;
      L: Colors.G;
      D: Colors.R;
    }
  | {
      U: Colors.O;
      F: Colors.Y;
      R: Colors.G;
      B: Colors.W;
      L: Colors.B;
      D: Colors.R;
    }
  | {
      U: Colors.O;
      F: Colors.G;
      R: Colors.W;
      B: Colors.B;
      L: Colors.Y;
      D: Colors.R;
    }
  | {
      U: Colors.O;
      F: Colors.B;
      R: Colors.Y;
      B: Colors.G;
      L: Colors.W;
      D: Colors.R;
    }
  // R
  | {
      U: Colors.R;
      F: Colors.W;
      R: Colors.G;
      B: Colors.Y;
      L: Colors.B;
      D: Colors.O;
    }
  | {
      U: Colors.R;
      F: Colors.Y;
      R: Colors.B;
      B: Colors.W;
      L: Colors.G;
      D: Colors.O;
    }
  | {
      U: Colors.R;
      F: Colors.B;
      R: Colors.W;
      B: Colors.G;
      L: Colors.Y;
      D: Colors.O;
    }
  | {
      U: Colors.R;
      F: Colors.G;
      R: Colors.Y;
      B: Colors.B;
      L: Colors.W;
      D: Colors.O;
    };
