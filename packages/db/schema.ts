import { type AnySQLiteColumn, snakeCase, text } from "drizzle-orm/sqlite-core";

const viewType = ["F2L", "OLL", "PLL"] as const;

export const cube = snakeCase.table("cube", {
	id: text().primaryKey(),
	name: text().notNull().unique(),
});

export const set = snakeCase.table("set", {
	id: text().primaryKey(),
	name: text().notNull().unique(),
	previewAlgorithm: text().notNull(),
	cubeId: text()
		.notNull()
		.references(() => cube.id),
	viewType: text({ enum: viewType }).notNull(),
});

export const subset = snakeCase.table("subset", {
	id: text().primaryKey(),
	name: text().notNull().unique(),
	previewAlgorithm: text().notNull(),
	setId: text()
		.notNull()
		.references(() => set.id),
});

export const case_ = snakeCase.table("case", {
	id: text().primaryKey(),
	name: text().notNull().unique(),
	setup: text().notNull(),
	subsetId: text()
		.notNull()
		.references(() => subset.id),
	defaultAlgorithmId: text().references((): AnySQLiteColumn => algorithm.id),
});

export const algorithm = snakeCase.table("algorithm", {
	id: text().primaryKey(),
	name: text().notNull().unique(),
	caseId: text()
		.notNull()
		.references(() => case_.id),
	rotations: text().notNull().unique(),
	mnemonics: text(),
	description: text(),
});
