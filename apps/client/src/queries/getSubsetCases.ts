import { getCollection, getEntry } from "astro:content";

export const getSubsetCases = async (subsetId: string) => {
  const subset = await getEntry("subsets", subsetId);

  if (!subset) throw new Error(`Subset with ID ${subsetId} not found`);

  const cases = await getCollection(
    "cases",
    (c) => c.data.subsetId.id === subsetId,
  );

  return cases.map(({ data }) => ({ ...data, subset: subset.data }));
};
