import { Faces } from "@/types/Faces";

type Slice<Value> = [Value, Value, Value];

export type AdjacentPieces<Face extends Faces, Value> = Face extends
  | Faces.U
  | Faces.D
  ? {
      face: Face;
      F: Slice<Value>;
      R: Slice<Value>;
      B: Slice<Value>;
      L: Slice<Value>;
    }
  : Face extends Faces.F | Faces.B
    ? {
        face: Face;
        U: Slice<Value>;
        R: Slice<Value>;
        D: Slice<Value>;
        L: Slice<Value>;
      }
    : Face extends Faces.L | Faces.R
      ? {
          face: Face;
          U: Slice<Value>;
          F: Slice<Value>;
          D: Slice<Value>;
          B: Slice<Value>;
        }
      : never;
