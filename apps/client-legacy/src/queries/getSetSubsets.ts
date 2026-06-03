import { getCollection } from "astro:content";

export const getSetSubsets = async (setId: string) => {
	const subsets = await getCollection(
		"subsets",
		(subset) => subset.data.setId.id === setId,
	);

	return subsets.map(({ data }) => data);
};
