import {defineCollection, defineContentConfig, z} from '@nuxt/content'

export default defineContentConfig({
    collections: {
        set: defineCollection({
            type: 'data',
            source: 'sets/**.json',
            schema: z.object({
                name: z.string(),
                viewMode: z.enum(['PLL', 'OLL', 'F2L']),
            })
        }),
        subsets: defineCollection({
            type: 'data',
            source: 'subsets/**/*.json',
            schema: z.object({
                name: z.string(),
                previewAlgorithm: z.string(),
                viewMode: z.enum(['PLL', 'OLL', 'F2L']),
                set: z.string(),
            })
        }),
        cases: defineCollection({
            type: 'data',
            source: 'cases/*.json',
            schema: z.object({
                case: z.string(),
                setup: z.string(),
                viewMode: z.enum(['PLL', 'OLL', 'F2L']),
                subset: z.string(),
                set: z.string(),
                algorithms: z.array(z.object({
                    rotations: z.string(),
                    rotationsMnemonic: z.string().nullable(),
                    description: z.string().nullable(),
                }))
            })
        })
    }
})

