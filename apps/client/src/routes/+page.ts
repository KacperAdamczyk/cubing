import { getAllCases, getSetCases, getSets } from '$lib/data/repository';
import { getBreadcrumbs } from '$lib/data/breadcrumbs';
import type { PreviewItem } from '$lib/data/types';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	const sets = getSets();
	const allCases = getAllCases();

	const items: PreviewItem[] = [
		{
			href: '/',
			name: 'All',
			previewAlgorithm: '',
			size: allCases.length,
			viewType: 'PLL',
			all: true
		},
		...sets.map((set) => ({
			href: `/${set.id}`,
			name: set.name,
			previewAlgorithm: '',
			size: getSetCases(set.id).length,
			viewType: set.viewType
		}))
	];

	return { items, cases: allCases, breadcrumbs: getBreadcrumbs() };
};
