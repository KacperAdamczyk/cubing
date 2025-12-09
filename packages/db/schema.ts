import {relations} from "drizzle-orm";
import {
    type AnySQLiteColumn,
    sqliteTable,
    text,
} from "drizzle-orm/sqlite-core";

const viewType = ["F2L", "OLL", "PLL"] as const;

export const cubes = sqliteTable("cubes", {
    id: text().primaryKey(),
    name: text().notNull().unique(),
});

export const cubesRelations = relations(cubes, ({many}) => ({
    sets: many(sets),
}));

export const sets = sqliteTable("sets", {
    id: text().primaryKey(),
    name: text().notNull().unique(),
    previewAlgorithm: text().notNull(),
    cubeId: text()
        .notNull()
        .references(() => cubes.id),
    viewType: text({enum: viewType}).notNull(),
});

export const setsRelations = relations(sets, ({one, many}) => ({
    cube: one(cubes, {fields: [sets.cubeId], references: [cubes.id]}),
    subsets: many(subsets),
}));

export const subsets = sqliteTable("subsets", {
    id: text().primaryKey(),
    name: text().notNull().unique(),
    previewAlgorithm: text().notNull(),
    setId: text()
        .notNull()
        .references(() => sets.id),
});

export const subsetsRelations = relations(subsets, ({one, many}) => ({
    set: one(sets, {fields: [subsets.setId], references: [sets.id]}),
    cases: many(cases),
}));

export const cases = sqliteTable("cases", {
    id: text().primaryKey(),
    name: text().notNull().unique(),
    setup: text().notNull(),
    subsetId: text()
        .notNull()
        .references(() => subsets.id),
    defaultAlgorithmId: text().references((): AnySQLiteColumn => algorithms.id),
});

export const casesRelations = relations(cases, ({one, many}) => ({
    subset: one(subsets, {fields: [cases.subsetId], references: [subsets.id]}),
    algorithms: many(algorithms),
}));

export const algorithms = sqliteTable("algorithms", {
    id: text().primaryKey(),
    name: text().notNull().unique(),
    caseId: text()
        .notNull()
        .references(() => cases.id),
    rotations: text().notNull().unique(),
    mnemonics: text(),
    description: text(),
});

export const algorithmsRelations = relations(algorithms, ({one}) => ({
    case: one(cases, {fields: [algorithms.caseId], references: [cases.id]}),
}));
