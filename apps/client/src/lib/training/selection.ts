import type { TrainingCube, TrainingEntry } from "$lib/data/types";

/* The training selection lives in the URL so a session is shareable, survives a
 * reload and round-trips between the picker and the stepper:
 *   /train?cases=Ua,Ub,H            — the picker, with those cases ticked
 *   /train/session?cases=Ua,Ub,H&step=2 — the stepper, on its 2nd case
 * `cases` is an ordered, comma-separated list of case ids (the order is the
 * training order); `step` is 1-based. */

export const pickerPath = "/train";
export const sessionPath = "/train/session";

const casesParam = "cases";
const stepParam = "step";

/** The case ids from `?cases=`, in URL order, de-duplicated; empty when absent. */
export const parseCaseIds = (params: URLSearchParams): string[] => [
	...new Set(
		(params.get(casesParam) ?? "")
			.split(",")
			.map((id) => id.trim())
			.filter(Boolean),
	),
];

/**
 * The 0-based index encoded by `?step=` (1-based in the URL), clamped into
 * `[0, total - 1]`; anything unparsable falls back to the first step.
 */
export const parseStep = (params: URLSearchParams, total: number): number => {
	const step = Number.parseInt(params.get(stepParam) ?? "", 10);
	if (!Number.isFinite(step) || total <= 0) return 0;
	return Math.min(Math.max(step - 1, 0), total - 1);
};

/**
 * Builds a training URL. Commas are left unencoded on purpose — ids are
 * URL-safe slugs and `?cases=Ua,Ub,H` reads better than `Ua%2CUb%2CH`.
 * `step` is the 0-based index and is written 1-based.
 */
export const trainingHref = (path: string, ids: readonly string[], step?: number): string => {
	const query = [
		ids.length > 0 && `${casesParam}=${ids.map(encodeURIComponent).join(",")}`,
		step !== undefined && step > 0 && `${stepParam}=${step + 1}`,
	].filter(Boolean);
	return query.length > 0 ? `${path}?${query.join("&")}` : path;
};

/** Every case of the tree with its ancestors, in tree (= catalogue) order. */
export const flattenTree = (tree: readonly TrainingCube[]): TrainingEntry[] =>
	tree.flatMap((cube) =>
		cube.sets.flatMap((set) =>
			set.subsets.flatMap((subset) => subset.cases.map((c) => ({ cube, set, subset, case: c }))),
		),
	);

/**
 * Resolves selected ids against the tree, keeping the ids' order and silently
 * dropping any id the catalogue no longer has (a stale or mistyped URL).
 */
export const resolveEntries = (
	entries: readonly TrainingEntry[],
	ids: readonly string[],
): TrainingEntry[] => {
	const byId = new Map(entries.map((entry) => [entry.case.id, entry]));
	return ids.flatMap((id) => byId.get(id) ?? []);
};

/**
 * Adds (`checked`) or removes a group of ids and returns the new selection in
 * tree order, so toggling a subset, a set or single cases always yields the
 * same canonical URL regardless of click order.
 */
export const toggleIds = (
	order: readonly string[],
	selected: ReadonlySet<string>,
	ids: readonly string[],
	checked: boolean,
): string[] => {
	const next = new Set(selected);
	for (const id of ids) {
		if (checked) next.add(id);
		else next.delete(id);
	}
	return order.filter((id) => next.has(id));
};
