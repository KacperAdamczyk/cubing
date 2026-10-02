import * as repo from "#lib/server/repository.js";

export const prerender = true;

export const entries = () =>
	repo.getSets().flatMap((set) =>
		repo.getSetSubsets(set.id).flatMap((subset) =>
			repo.getSubsetCases(subset.id).map((c) => ({
				cubeId: set.cubeId,
				setId: set.id,
				subsetId: subset.id,
				caseId: c.id,
			})),
		),
	);
