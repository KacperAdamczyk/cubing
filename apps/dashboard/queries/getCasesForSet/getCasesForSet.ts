import { db } from "@repo/db";
import { unstable_cache } from "next/cache";

export const getCasesForSet = unstable_cache(
	(setId: string) =>
		db().query.subsets.findMany({
			where: (subsets, { eq }) => eq(subsets.setId, setId),
			with: {
				cases: {
					with: {
						algorithms: true,
						subset: {
							with: {
								set: true,
							},
						},
					},
				},
			},
		}),
	["cases-for-set"],
);

export type GetCasesForSetEntity = Awaited<
	ReturnType<typeof getCasesForSet>
>[number];
