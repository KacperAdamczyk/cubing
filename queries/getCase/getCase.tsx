import { db } from "@/db";
import { unstable_cache } from "next/cache";

export const getCase = unstable_cache(
  (caseId: string) =>
    db.query.cases.findFirst({
      where: (cases, { eq }) => eq(cases.id, caseId),
      with: {
        algorithms: true,
        subset: {
          with: {
            set: true,
          },
        },
      },
    }),
  ["get-case"],
);

export type GetCaseEntity = Awaited<ReturnType<typeof getCase>>;
