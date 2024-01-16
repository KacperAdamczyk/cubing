type Slice<Value> = [Value, Value, Value];

export enum AdjacentFaces {
  Top = "Top",
  Bottom = "Bottom",
  Left = "Left",
  Right = "Right",
}

export type AdjacentPieces<Value> = Record<AdjacentFaces, Slice<Value>>;
