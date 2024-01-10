import { db } from "@repo/db";
import { unstable_cache } from "next/cache";

export const getSubsets = unstable_cache((setId: string) =>
  db().query.subsets.findMany({
    where: (subsets, { eq }) => eq(subsets.setId, setId),
  })
);
