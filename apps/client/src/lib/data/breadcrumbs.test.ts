import { describe, expect, it } from "vitest";
import { getBreadcrumbs } from "./breadcrumbs";
import type { SidebarCube } from "./types";

const tree: SidebarCube[] = [
	{
		id: "3x3",
		name: "3x3",
		sets: [
			{
				id: "OLL",
				name: "OLL",
				previewAlgorithm: "",
				cubeId: "3x3",
				viewType: "OLL",
				subsets: [
					{
						id: "Oriented-Edges",
						name: "Oriented Edges",
						previewAlgorithm: "",
						setId: "OLL",
						cases: [{ id: "OLL-21", name: "Cross" }],
					},
				],
			},
		],
	},
];

describe("getBreadcrumbs", () => {
	it("always starts with the Algorithms root", () => {
		expect(getBreadcrumbs(tree, {})).toEqual([{ name: "Algorithms", href: "/" }]);
	});

	it("builds nested crumbs for cube/set/subset/case", () => {
		expect(
			getBreadcrumbs(tree, {
				cubeId: "3x3",
				setId: "OLL",
				subsetId: "Oriented-Edges",
				caseId: "OLL-21",
			}),
		).toEqual([
			{ name: "Algorithms", href: "/" },
			{ name: "3x3", href: "/3x3" },
			{ name: "OLL", href: "/3x3/OLL" },
			{ name: "Oriented Edges", href: "/3x3/OLL/Oriented-Edges" },
			{ name: "Cross", href: "/3x3/OLL/Oriented-Edges/OLL-21" },
		]);
	});

	it("builds training crumbs that carry the selection query", () => {
		expect(getBreadcrumbs(tree, {}, { pathname: "/train", search: "?cases=OLL-21" })).toEqual([
			{ name: "Algorithms", href: "/" },
			{ name: "Training", href: "/train?cases=OLL-21" },
		]);
		expect(
			getBreadcrumbs(tree, {}, { pathname: "/train/session", search: "?cases=OLL-21&step=2" }),
		).toEqual([
			{ name: "Algorithms", href: "/" },
			{ name: "Training", href: "/train?cases=OLL-21&step=2" },
			{ name: "Session", href: "/train/session?cases=OLL-21&step=2" },
		]);
	});

	it("ignores the location for catalogue routes", () => {
		expect(getBreadcrumbs(tree, { cubeId: "3x3" }, { pathname: "/3x3", search: "" })).toEqual([
			{ name: "Algorithms", href: "/" },
			{ name: "3x3", href: "/3x3" },
		]);
	});
});
