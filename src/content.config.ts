import { defineCollection, z, reference } from "astro:content";

import { file } from "astro/loaders";

const viewTypeSchema = z.enum(["PLL", "OLL", "F2L"]);
export type ViewType = z.infer<typeof viewTypeSchema>;

const sets = defineCollection({
  loader: file("src/data/sets.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
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

const cases = defineCollection({
  loader: file("src/data/cases.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    setup: z.string(),
    viewType: viewTypeSchema,
    subsetId: reference("subsets"),
    mainAlgorithmId: reference("algorithms").nullable(),
  }),
});

const algorithms = defineCollection({
  loader: file("src/data/algorithms.json"),
  schema: z.object({
    id: z.string(),
    rotations: z.string(),
    rotationsMnemonic: z.string().nullable(),
    description: z.string().nullable(),
    caseId: reference("cases"),
  }),
});

export const collections = { sets, subsets, cases, algorithms };
