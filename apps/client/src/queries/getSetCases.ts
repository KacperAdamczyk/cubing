import { getSetSubsets } from "@/queries/getSetSubsets";
import { getSubsetCases } from "@/queries/getSubsetCases";
import { getEntry } from "astro:content";

export const getSetCases = async (setId: string) => {
  const set = await getEntry("sets", setId);

  if (!set) throw new Error(`Set with ID ${setId} not found`);

  const subsets = await getSetSubsets(setId);
  const cases = await Promise.all(
    subsets.map(async ({ id }) => getSubsetCases(id)),
  );

  return cases.flat();
};
