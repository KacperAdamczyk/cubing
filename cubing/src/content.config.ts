import { defineCollection, z, reference } from "astro:content";

import { file } from "astro/loaders";

const sets = defineCollection({
  loader: file("src/data/sets.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export const collections = { sets };
