import { error } from '@sveltejs/kit';
import { prerender } from '$app/server';
import { z } from 'zod';
import * as repo from '$lib/server/repository';
import type { PreviewItem } from './types';

export const getSidebar = prerender(() => repo.getSidebarTree());

export const getHomeView = prerender(() => {
	const sets = repo.getSets();
	const cases = repo.getAllCases();
	const items: PreviewItem[] = [
		{
			href: '/',
			name: 'All',
			previewAlgorithm: '',
			size: cases.length,
			viewType: 'PLL',
			all: true
		},
		...sets.map((set) => ({
			href: `/${set.id}`,
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
	const subsets = repo.getSetSubsets(set.id);
	const cases = repo.getSetCases(set.id);
	const items: PreviewItem[] = [
		{
			href: `/${set.id}`,
			name: 'All',
			previewAlgorithm: '',
			size: cases.length,
			viewType: set.viewType
		},
		...subsets.map((subset) => ({
			href: `/${set.id}/${subset.id}`,
			name: subset.name,
			previewAlgorithm: subset.previewAlgorithm,
			size: repo.getSubsetCases(subset.id).length,
			viewType: set.viewType
		}))
	];
	return { items, cases };
});

export const getSubsetView = prerender(
	z.object({ setId: z.string(), subsetId: z.string() }),
	({ setId, subsetId }) => {
		const set = repo.findSet(setId);
		const subset = repo.findSubset(subsetId);
		if (!set || !subset) error(404, 'Not found');
		const subsets = repo.getSetSubsets(set.id);
		const cases = repo.getSubsetCases(subset.id);
		const items: PreviewItem[] = [
			{
				href: `/${set.id}`,
				name: 'All',
				previewAlgorithm: '',
				size: repo.getSetCases(set.id).length,
				viewType: set.viewType
			},
			...subsets.map((s) => ({
				href: `/${set.id}/${s.id}`,
				name: s.name,
				previewAlgorithm: s.previewAlgorithm,
				size: repo.getSubsetCases(s.id).length,
				viewType: set.viewType
			}))
		];
		return { items, cases };
	}
);

export const getCaseView = prerender(z.string(), (caseId) => {
	const c = repo.getCase(caseId);
	if (!c) error(404, 'Case not found');
	return c;
});
