import { error } from '@sveltejs/kit';
import { prerender } from '$app/server';
import { z } from 'zod';
import * as repo from '$lib/server/repository';
import type { PreviewItem } from './types';

export const getSidebar = prerender(() => repo.getSidebarTree());

export const getCubesView = prerender((): PreviewItem[] =>
	repo.getCubes().map((cube) => ({
		href: `/${cube.id}`,
		name: cube.name,
		previewAlgorithm: '',
		size: repo.getCubeCases(cube.id).length,
		viewType: 'PLL',
		all: true
	}))
);

export const getCubeView = prerender(z.string(), (cubeId) => {
	const cube = repo.findCube(cubeId);
	if (!cube) error(404, 'Cube not found');
	const sets = repo.getCubeSets(cubeId);
	const cases = repo.getCubeCases(cubeId);
	const items: PreviewItem[] = [
		{
			href: `/${cubeId}`,
			name: 'All',
			previewAlgorithm: '',
			size: cases.length,
			viewType: 'PLL',
			all: true
		},
		...sets.map((set) => ({
			href: `/${cubeId}/${set.id}`,
			name: set.name,
			previewAlgorithm: '',
			size: repo.getSetCases(set.id).length,
			viewType: set.viewType
		}))
	];
	return { items, cases };
});

export const getSetView = prerender(z.string(), (setId) => {
	const set = repo.findSet(setId);
	if (!set) error(404, 'Set not found');
	const cubeId = set.cubeId;
	const subsets = repo.getSetSubsets(set.id);
	const cases = repo.getSetCases(set.id);
	const items: PreviewItem[] = [
		{
			href: `/${cubeId}/${set.id}`,
			name: 'All',
			previewAlgorithm: '',
			size: cases.length,
			viewType: set.viewType
		},
		...subsets.map((subset) => ({
			href: `/${cubeId}/${set.id}/${subset.id}`,
			name: subset.name,
			previewAlgorithm: subset.previewAlgorithm,
			size: repo.getSubsetCases(subset.id).length,
			viewType: set.viewType
		}))
	];
	return { items, cases };
});

export const getSubsetView = prerender(z.string(), (subsetId) => {
	const subset = repo.findSubset(subsetId);
	const set = subset && repo.findSet(subset.setId);
	if (!subset || !set) error(404, 'Not found');
	const cubeId = set.cubeId;
	const subsets = repo.getSetSubsets(set.id);
	const cases = repo.getSubsetCases(subset.id);
	const items: PreviewItem[] = [
		{
			href: `/${cubeId}/${set.id}`,
			name: 'All',
			previewAlgorithm: '',
			size: repo.getSetCases(set.id).length,
			viewType: set.viewType
		},
		...subsets.map((s) => ({
			href: `/${cubeId}/${set.id}/${s.id}`,
			name: s.name,
			previewAlgorithm: s.previewAlgorithm,
			size: repo.getSubsetCases(s.id).length,
			viewType: set.viewType
		}))
	];
	return { items, cases };
});

export const getCaseView = prerender(z.string(), (caseId) => {
	const c = repo.getCase(caseId);
	if (!c) error(404, 'Case not found');
	return c;
});
