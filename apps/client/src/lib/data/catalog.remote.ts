import { error } from "@sveltejs/kit";
import { z } from "zod";
import { prerender } from "$app/server";
import * as repo from "$lib/server/repository";
import type { Case, CaseNeighbor, CubeSummary, PreviewItem } from "./types";

export const getSidebar = prerender(() => repo.getSidebarTree());

export const getCubesView = prerender((): CubeSummary[] =>
	repo.getCubes().map((cube) => ({
		...cube,
		href: `/${cube.id}`,
		size: repo.getCubeCases(cube.id).length,
		sets: repo.getCubeSets(cube.id).map((set) => ({
			id: set.id,
			name: set.name,
			viewType: set.viewType,
			href: `/${cube.id}/${set.id}`,
			size: repo.getSetCases(set.id).length,
		})),
	})),
);

export const getCubeView = prerender(z.string(), (cubeId) => {
	const cube = repo.findCube(cubeId);
	if (!cube) error(404, "Cube not found");
	const sets = repo.getCubeSets(cubeId);
	const cases = repo.getCubeCases(cubeId);
	const items: PreviewItem[] = [
		{
			href: `/${cubeId}`,
			name: "All",
			previewAlgorithm: "",
			size: cases.length,
			viewType: "PLL",
			all: true,
		},
		...sets.map((set) => ({
			href: `/${cubeId}/${set.id}`,
			name: set.name,
			previewAlgorithm: "",
			size: repo.getSetCases(set.id).length,
			viewType: set.viewType,
		})),
	];
	return { cube, sets, items, cases };
});

export const getSetView = prerender(z.string(), (setId) => {
	const set = repo.findSet(setId);
	const cube = set && repo.findCube(set.cubeId);
	if (!set || !cube) error(404, "Set not found");
	const cubeId = set.cubeId;
	const subsets = repo.getSetSubsets(set.id);
	const cases = repo.getSetCases(set.id);
	const items: PreviewItem[] = [
		{
			href: `/${cubeId}/${set.id}`,
			name: "All",
			previewAlgorithm: "",
			size: cases.length,
			viewType: set.viewType,
		},
		...subsets.map((subset) => ({
			href: `/${cubeId}/${set.id}/${subset.id}`,
			name: subset.name,
			previewAlgorithm: subset.previewAlgorithm,
			size: repo.getSubsetCases(subset.id).length,
			viewType: set.viewType,
		})),
	];
	return { cube, set, subsets, items, cases };
});

export const getSubsetView = prerender(z.string(), (subsetId) => {
	const subset = repo.findSubset(subsetId);
	const set = subset && repo.findSet(subset.setId);
	const cube = set && repo.findCube(set.cubeId);
	if (!subset || !set || !cube) error(404, "Not found");
	const cubeId = set.cubeId;
	const subsets = repo.getSetSubsets(set.id);
	const cases = repo.getSubsetCases(subset.id);
	const items: PreviewItem[] = [
		{
			href: `/${cubeId}/${set.id}`,
			name: "All",
			previewAlgorithm: "",
			size: repo.getSetCases(set.id).length,
			viewType: set.viewType,
		},
		...subsets.map((s) => ({
			href: `/${cubeId}/${set.id}/${s.id}`,
			name: s.name,
			previewAlgorithm: s.previewAlgorithm,
			size: repo.getSubsetCases(s.id).length,
			viewType: set.viewType,
		})),
	];
	return { cube, set, subset, items, cases };
});

export const getCaseView = prerender(z.string(), (caseId) => {
	const c = repo.getCase(caseId);
	if (!c) error(404, "Case not found");
	const { cubeId } = c.subset.set;
	const siblings = repo.getSubsetCases(c.subsetId);
	const index = siblings.findIndex((s) => s.id === c.id);
	const toNeighbor = (s: Case | undefined): CaseNeighbor | null =>
		s
			? {
					id: s.id,
					name: s.name,
					setup: s.setup,
					href: `/${cubeId}/${c.subset.setId}/${c.subsetId}/${s.id}`,
				}
			: null;
	return {
		case: c,
		// `.at(-1)` would wrap around to the last case, so the first case has no prev.
		prev: toNeighbor(index > 0 ? siblings.at(index - 1) : undefined),
		next: toNeighbor(siblings.at(index + 1)),
		position: { index: index + 1, total: siblings.length },
	};
});
