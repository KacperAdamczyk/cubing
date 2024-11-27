import { db } from "@/db";
import { unstable_cache } from "next/cache";

export const getSubsets = unstable_cache(
  (setId: string) =>
    db.query.subsets.findMany({
      where: (subsets, { eq }) => eq(subsets.setId, setId),
      with: {
        cases: true,
      },
    }),
  ["subsets"],
);

export type GetSubsetsEntity = Awaited<ReturnType<typeof getSubsets>>[number];
