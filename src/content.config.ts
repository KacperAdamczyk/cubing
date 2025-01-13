import { defineCollection, z, reference } from "astro:content";

import { file } from "astro/loaders";

const viewTypeSchema = z.enum(["PLL", "OLL", "F2L"]);
export type ViewType = z.infer<typeof viewTypeSchema>;

const sets = defineCollection({
  loader: file("src/data/sets.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    viewType: viewTypeSchema,
  }),
});

const subsets = defineCollection({
  loader: file("src/data/subsets.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    previewAlgorithm: z.string(),
    viewType: viewTypeSchema,
    setId: reference("sets"),
  }),
});

const algorithmSchema = z.object({
  rotations: z.string(),
  rotationsMnemonic: z.string().nullable(),
  description: z.string().nullable(),
});

export type Algorithm = z.infer<typeof algorithmSchema>;

const cases = defineCollection({
  loader: file("src/data/cases.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    setup: z.string(),
    viewType: viewTypeSchema,
    subsetId: reference("subsets"),
    algorithms: z.array(algorithmSchema).min(1),
  }),
});

export const collections = { sets, subsets, cases };
