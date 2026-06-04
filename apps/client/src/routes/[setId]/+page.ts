import { error } from '@sveltejs/kit';
import { findSet, getSetCases, getSets, getSetSubsets, getSubsetCases } from '$lib/data/repository';
import { getBreadcrumbs } from '$lib/data/breadcrumbs';
import type { PreviewItem } from '$lib/data/types';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => getSets().map((set) => ({ setId: set.id }));

export const load: PageLoad = ({ params }) => {
	const set = findSet(params.setId);
	if (!set) error(404, 'Set not found');

	const subsets = getSetSubsets(set.id);
	const cases = getSetCases(set.id);

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
			size: getSubsetCases(subset.id).length,
			viewType: set.viewType
		}))
	];

	return { items, cases, breadcrumbs: getBreadcrumbs({ set }) };
};
