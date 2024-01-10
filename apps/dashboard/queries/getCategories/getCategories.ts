import { db } from "@repo/db";
import { unstable_cache } from "next/cache";

export const getCategories = unstable_cache(
  () => db().query.categories.findMany(),
  ["categories"]
);
