import { getSetCases } from "@/queries/getSetCases";
import { getCollection } from "astro:content";

export const getAllCases = async () => {
	const sets = await getCollection("sets");

	const cases = await Promise.all(
		sets.map(async (set) => {
			const cases = await getSetCases(set.id);

			return [set, cases] as const;
		}),
	);

	return cases.flatMap(([set, cases]) =>
		cases.map((c) => ({ ...c, set: set.data })),
	);
};
