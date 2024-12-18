import { Colors } from "@/cube/types/Colors";

export type ColorOrientation =
  // Y
  | { U: Colors.Y; F: Colors.B }
  | { U: Colors.Y; F: Colors.G }
  | { U: Colors.Y; F: Colors.O }
  | { U: Colors.Y; F: Colors.R }
  // W
  | { U: Colors.W; F: Colors.B }
  | { U: Colors.W; F: Colors.G }
  | { U: Colors.W; F: Colors.O }
  | { U: Colors.W; F: Colors.R }
  // G
  | { U: Colors.G; F: Colors.O }
  | { U: Colors.G; F: Colors.R }
  | { U: Colors.G; F: Colors.W }
  | { U: Colors.G; F: Colors.Y }
  // B
  | { U: Colors.B; F: Colors.Y }
  | { U: Colors.B; F: Colors.O }
  | { U: Colors.B; F: Colors.W }
  | { U: Colors.B; F: Colors.R }
  // O
  | { U: Colors.O; F: Colors.G }
  | { U: Colors.O; F: Colors.W }
  | { U: Colors.O; F: Colors.B }
  | { U: Colors.O; F: Colors.Y }
  // R
  | { U: Colors.R; F: Colors.G }
  | { U: Colors.R; F: Colors.Y }
  | { U: Colors.R; F: Colors.B }
  | { U: Colors.R; F: Colors.W };
