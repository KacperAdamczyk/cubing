import { error } from '@sveltejs/kit';
import {
	findSet,
	findSubset,
	getSetCases,
	getSets,
	getSetSubsets,
	getSubsetCases
} from '$lib/data/repository';
import { getBreadcrumbs } from '$lib/data/breadcrumbs';
import type { PreviewItem } from '$lib/data/types';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () =>
	getSets().flatMap((set) =>
		getSetSubsets(set.id).map((subset) => ({ setId: set.id, subsetId: subset.id }))
	);

export const load: PageLoad = ({ params }) => {
	const set = findSet(params.setId);
	const subset = findSubset(params.subsetId);
	if (!set || !subset) error(404, 'Not found');

	const subsets = getSetSubsets(set.id);
	const cases = getSubsetCases(subset.id);

	const items: PreviewItem[] = [
		{
			href: `/${set.id}`,
			name: 'All',
			previewAlgorithm: '',
			size: getSetCases(set.id).length,
			viewType: set.viewType
		},
		...subsets.map((s) => ({
			href: `/${set.id}/${s.id}`,
			name: s.name,
			previewAlgorithm: s.previewAlgorithm,
			size: getSubsetCases(s.id).length,
			viewType: set.viewType
		}))
	];

	return { items, cases, breadcrumbs: getBreadcrumbs({ set, subset }) };
};
