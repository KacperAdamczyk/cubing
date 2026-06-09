import type { Face } from "@/cube/types/Face";

/**
 * `Object.entries` for a record keyed by `Face`, keeping the key typed as
 * `Face` instead of widening it to `string`.
 */
export const faceEntries = <Value>(
	record: Record<Face, Value>,
): [Face, Value][] => Object.entries(record) as [Face, Value][];
