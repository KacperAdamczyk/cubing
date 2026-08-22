import type { ViewType } from "./types";

/** Human-readable name + one-line explainer for each step a set belongs to. */
export const viewTypeInfo: Record<ViewType, { label: string; description: string }> = {
	F2L: {
		label: "First Two Layers",
		description:
			"Pair up a corner with its edge and insert the pair into its slot, solving the first two layers together.",
	},
	OLL: {
		label: "Orientation of the Last Layer",
		description:
			"Orient every last-layer piece so the whole top face shows a single colour, ready for permutation.",
	},
	PLL: {
		label: "Permutation of the Last Layer",
		description:
			"Permute the already-oriented last-layer pieces into their final positions to finish the solve.",
	},
};
