import * as repo from "#lib/server/repository.js";

export const prerender = true;

export const entries = () =>
	repo.getSets().flatMap((set) =>
		repo.getSetSubsets(set.id).map((subset) => ({
			cubeId: set.cubeId,
			setId: set.id,
			subsetId: subset.id,
		})),
	);
