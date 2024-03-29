import { db } from "@repo/db";
import { unstable_cache } from "next/cache";

export const getSets = unstable_cache(
  () => db().query.sets.findMany(),
  ["sets"],
);
