import * as repo from '$lib/server/repository';

export const prerender = true;

export const entries = () =>
	repo.getSets().flatMap((set) =>
		repo.getSetSubsets(set.id).map((subset) => ({ setId: set.id, subsetId: subset.id }))
	);
