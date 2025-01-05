import { getSetCases } from "@/queries/getSetCases";
import { getCollection } from "astro:content";

export const getAllCases = async () => {
  const sets = await getCollection("sets");

  const cases = await Promise.all(sets.map(({ id }) => getSetCases(id)));

  return cases.flat();
};
