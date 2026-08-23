import { describe, expect, it } from "vitest";
import type { TrainingCube } from "$lib/data/types";
import {
	flattenTree,
	parseCaseIds,
	parseStep,
	resolveEntries,
	toggleIds,
	trainingHref,
} from "./selection";

const tree: TrainingCube[] = [
	{
		id: "3x3",
		name: "3x3",
		sets: [
			{
				id: "PLL",
				name: "PLL",
				previewAlgorithm: "",
				cubeId: "3x3",
				viewType: "PLL",
				subsets: [
					{
						id: "Edges-Only",
						name: "Edges Only",
						previewAlgorithm: "",
						setId: "PLL",
						cases: [
							{
								id: "Ua",
								name: "Ua",
								setup: "",
								subsetId: "Edges-Only",
								defaultAlgorithmId: null,
								algorithms: [],
							},
							{
								id: "Ub",
								name: "Ub",
								setup: "",
								subsetId: "Edges-Only",
								defaultAlgorithmId: null,
								algorithms: [],
							},
						],
					},
					{
						id: "Corners-Only",
						name: "Corners Only",
						previewAlgorithm: "",
						setId: "PLL",
						cases: [
							{
								id: "Aa",
								name: "Aa",
								setup: "",
								subsetId: "Corners-Only",
								defaultAlgorithmId: null,
								algorithms: [],
							},
						],
					},
				],
			},
		],
	},
];

describe("parseCaseIds", () => {
	it("reads an ordered, de-duplicated list and ignores blanks", () => {
		expect(parseCaseIds(new URLSearchParams("cases=Ub,Ua,,Ub, Aa"))).toEqual(["Ub", "Ua", "Aa"]);
	});

	it("is empty when the param is missing", () => {
		expect(parseCaseIds(new URLSearchParams(""))).toEqual([]);
	});
});

describe("parseStep", () => {
	it("converts the 1-based step to a clamped 0-based index", () => {
		expect(parseStep(new URLSearchParams("step=2"), 3)).toBe(1);
		expect(parseStep(new URLSearchParams("step=9"), 3)).toBe(2);
		expect(parseStep(new URLSearchParams("step=0"), 3)).toBe(0);
		expect(parseStep(new URLSearchParams("step=nope"), 3)).toBe(0);
		expect(parseStep(new URLSearchParams(""), 3)).toBe(0);
		expect(parseStep(new URLSearchParams("step=2"), 0)).toBe(0);
	});
});

describe("trainingHref", () => {
	it("keeps commas readable and omits an empty selection / first step", () => {
		expect(trainingHref("/train", ["Ua", "Ub"])).toBe("/train?cases=Ua,Ub");
		expect(trainingHref("/train", [])).toBe("/train");
		expect(trainingHref("/train/session", ["Ua"], 0)).toBe("/train/session?cases=Ua");
		expect(trainingHref("/train/session", ["Ua", "Ub"], 1)).toBe(
			"/train/session?cases=Ua,Ub&step=2",
		);
	});

	it("round-trips through the parsers", () => {
		const url = new URL(trainingHref("/train/session", ["F2L-6-FR", "OLL-21"], 1), "http://x");
		expect(parseCaseIds(url.searchParams)).toEqual(["F2L-6-FR", "OLL-21"]);
		expect(parseStep(url.searchParams, 2)).toBe(1);
	});
});

describe("flattenTree / resolveEntries", () => {
	const entries = flattenTree(tree);

	it("flattens in tree order with ancestors attached", () => {
		expect(entries.map((e) => e.case.id)).toEqual(["Ua", "Ub", "Aa"]);
		expect(entries[2].subset.id).toBe("Corners-Only");
		expect(entries[2].set.viewType).toBe("PLL");
		expect(entries[2].cube.id).toBe("3x3");
	});

	it("resolves ids in URL order and drops unknown ones", () => {
		expect(resolveEntries(entries, ["Aa", "nope", "Ua"]).map((e) => e.case.id)).toEqual([
			"Aa",
			"Ua",
		]);
	});
});

describe("toggleIds", () => {
	const order = ["Ua", "Ub", "Aa"];

	it("adds a group and returns the selection in tree order", () => {
		expect(toggleIds(order, new Set(["Aa"]), ["Ub", "Ua"], true)).toEqual(["Ua", "Ub", "Aa"]);
	});

	it("removes a group", () => {
		expect(toggleIds(order, new Set(["Ua", "Ub", "Aa"]), ["Ua", "Ub"], false)).toEqual(["Aa"]);
	});
});
