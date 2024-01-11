import { db } from "@repo/db";
import { unstable_cache } from "next/cache";

export const getCases = unstable_cache(
  () =>
    db().query.cases.findMany({
      with: {
        algorithms: true,
        subset: true,
      },
    }),
  ["cases"],
);

export type GetCasesEntity = Awaited<ReturnType<typeof getCases>>[number];
