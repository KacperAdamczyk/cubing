import { relations } from "drizzle-orm";
import {
	type AnySQLiteColumn,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";

const viewType = ["F2L", "OLL", "PLL"] as const;

export const cube = sqliteTable("cube", {
	id: text().primaryKey(),
	name: text().notNull().unique(),
});

export const cubeRelations = relations(cube, ({ many }) => ({
	sets: many(set),
}));

export const set = sqliteTable("set", {
	id: text().primaryKey(),
	name: text().notNull().unique(),
	previewAlgorithm: text().notNull(),
	cubeId: text()
		.notNull()
		.references(() => cube.id),
	viewType: text({ enum: viewType }).notNull(),
});

export const setRelations = relations(set, ({ one, many }) => ({
	cube: one(cube, { fields: [set.cubeId], references: [cube.id] }),
	subsets: many(subset),
}));

export const subset = sqliteTable("subset", {
	id: text().primaryKey(),
	name: text().notNull().unique(),
	previewAlgorithm: text().notNull(),
	setId: text()
		.notNull()
		.references(() => set.id),
});

export const subsetRelations = relations(subset, ({ one, many }) => ({
	set: one(set, { fields: [subset.setId], references: [set.id] }),
	cases: many(case_),
}));

export const case_ = sqliteTable("case", {
	id: text().primaryKey(),
	name: text().notNull().unique(),
	setup: text().notNull(),
	subsetId: text()
		.notNull()
		.references(() => subset.id),
	defaultAlgorithmId: text().references((): AnySQLiteColumn => algorithm.id),
});

export const caseRelations = relations(case_, ({ one, many }) => ({
	subset: one(subset, { fields: [case_.subsetId], references: [subset.id] }),
	algorithms: many(algorithm),
}));

export const algorithm = sqliteTable("algorithm", {
	id: text().primaryKey(),
	name: text().notNull().unique(),
	caseId: text()
		.notNull()
		.references(() => case_.id),
	rotations: text().notNull().unique(),
	mnemonics: text(),
	description: text(),
});

export const algorithmRelations = relations(algorithm, ({ one }) => ({
	case: one(case_, { fields: [algorithm.caseId], references: [case_.id] }),
}));
