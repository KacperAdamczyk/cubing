import { db } from "@repo/db";
import { unstable_cache } from "next/cache";

export const getCasesForSubset = unstable_cache(
  (subsetId: string) =>
    db().query.cases.findMany({
      where: (cases, { eq }) => eq(cases.subsetId, subsetId),
      with: {
        algorithms: true,
        subset: true,
      },
    }),
  ["cases-for-subset"],
);

export type GetCasesForSubsetEntity = Awaited<
  ReturnType<typeof getCasesForSubset>
>[number];
