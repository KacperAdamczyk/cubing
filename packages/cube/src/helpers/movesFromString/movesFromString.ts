import { isMove, type Move } from "@/cube/types/Move";

const moveRegexp = /[UDFBLRudfblrMSExyz]2?'?/g;

export const movesFromString = (algorithm: string): Move[] =>
	algorithm.match(moveRegexp)?.filter(isMove) ?? [];
