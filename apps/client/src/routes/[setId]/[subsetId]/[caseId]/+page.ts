import { error } from '@sveltejs/kit';
import {
	findSet,
	findSubset,
	getCase,
	getSets,
	getSetSubsets,
	getSubsetCases
} from '$lib/data/repository';
import { getBreadcrumbs } from '$lib/data/breadcrumbs';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () =>
	getSets().flatMap((set) =>
		getSetSubsets(set.id).flatMap((subset) =>
			getSubsetCases(subset.id).map((c) => ({
				setId: set.id,
				subsetId: subset.id,
				caseId: c.id
			}))
		)
	);

export const load: PageLoad = ({ params }) => {
	const set = findSet(params.setId);
	const subset = findSubset(params.subsetId);
	const currentCase = getCase(params.caseId);
	if (!set || !subset || !currentCase) error(404, 'Case not found');

	return {
		case: currentCase,
		breadcrumbs: getBreadcrumbs({ set, subset, case: currentCase })
	};
};
