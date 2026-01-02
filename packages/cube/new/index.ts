type CubeSize = 2 | 3 | 4;

// Number of pieces n3−(n−2)3=6n2−12n+8
// Corners: 8
// Edges: 12(n-2)
// Centers: 6(n-2)2

type Range<
  To extends number,
  Acc extends number[] = [],
> = Acc["length"] extends To ? Acc : Range<To, [...Acc, Acc["length"]]>;

type BuildTuple<
  Length extends number,
  Item extends unknown,
  Tuple extends Item[] = [],
> = Tuple["length"] extends Length
  ? Tuple
  : BuildTuple<Length, Item, [...Tuple, Item]>;

type Subtract<A extends number, B extends number> =
  Range<A> extends [...Range<B>, ...infer R] ? R["length"] : never;

type Multiply<
  A extends number,
  B extends number,
  R extends unknown[] = [],
> = B extends 0
  ? R["length"]
  : Multiply<A, Subtract<B, 1>, [...R, ...Range<A>]>;

type Cube<N extends number> = Multiply<Multiply<N, N>, N>;

type PiecesCount<N extends number> = Subtract<Cube<N>, Cube<Subtract<N, 2>>>;

type Piece = { kind: "cubie" };

type Pieces<Size extends CubeSize> = BuildTuple<PiecesCount<Size>, Piece>;

interface CubeDefinition<Size extends CubeSize> {
  size: Size;
}

function defineCube<Size extends CubeSize>(definition: CubeDefinition<Size>) {}
