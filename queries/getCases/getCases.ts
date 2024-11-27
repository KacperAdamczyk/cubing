import { db } from "@/db";
import { unstable_cache } from "next/cache";

export const getCases = unstable_cache(
  () =>
    db.query.cases.findMany({
      with: {
        algorithms: true,
        subset: {
          with: {
            set: true,
          },
        },
      },
    }),
  ["cases"],
);

export type GetCasesEntity = Awaited<ReturnType<typeof getCases>>[number];
