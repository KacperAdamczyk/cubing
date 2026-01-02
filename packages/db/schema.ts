import { defineRelations } from "drizzle-orm";
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

export const set = sqliteTable("set", {
	id: text().primaryKey(),
	name: text().notNull().unique(),
	previewAlgorithm: text().notNull(),
	cubeId: text()
		.notNull()
		.references(() => cube.id),
	viewType: text({ enum: viewType }).notNull(),
});

export const subset = sqliteTable("subset", {
	id: text().primaryKey(),
	name: text().notNull().unique(),
	previewAlgorithm: text().notNull(),
	setId: text()
		.notNull()
		.references(() => set.id),
});

export const case_ = sqliteTable("case", {
	id: text().primaryKey(),
	name: text().notNull().unique(),
	setup: text().notNull(),
	subsetId: text()
		.notNull()
		.references(() => subset.id),
	defaultAlgorithmId: text().references((): AnySQLiteColumn => algorithm.id),
});

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

export const relations = defineRelations(
	{ cube, set, subset, case_, algorithm },
	(r) => ({
		cube: {
			sets: r.many.set(),
		},
		set: {
			cube: r.one.cube({
				from: r.set.cubeId,
				to: r.cube.id,
			}),
			subsets: r.many.subset(),
		},
		subset: {
			set: r.one.set({
				from: r.subset.setId,
				to: r.set.id,
			}),
			cases: r.many.case_(),
		},
		case_: {
			subset: r.one.subset({
				from: r.case_.subsetId,
				to: r.subset.id,
			}),
			algorithms: r.many.algorithm(),
		},
		algorithm: {
			case: r.one.case_({
				from: r.algorithm.caseId,
				to: r.case_.id,
			}),
		},
	}),
);
