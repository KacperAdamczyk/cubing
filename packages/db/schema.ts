import { relations } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const sets = sqliteTable("sets", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const setsRelations = relations(sets, ({ many }) => ({
  subsets: many(subsets),
}));

export type Set = typeof sets.$inferSelect;

export const subsets = sqliteTable("subsets", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  previewAlgorithm: text("preview_algorithm").notNull(),
  setId: text("set_id")
    .notNull()
    .references(() => sets.id),
});

export const subsetsRelations = relations(subsets, ({ one, many }) => ({
  set: one(sets, {
    fields: [subsets.setId],
    references: [sets.id],
  }),
  cases: many(cases),
}));

export type Subset = typeof subsets.$inferSelect;

export const cases = sqliteTable("cases", {
  id: text("id").primaryKey(),
  name: text("name"),
  setup: text("setup").notNull(),
  subsetId: text("subset_id")
    .notNull()
    .references(() => subsets.id),
});

export const casesRelations = relations(cases, ({ one, many }) => ({
  subset: one(subsets, {
    fields: [cases.subsetId],
    references: [subsets.id],
  }),
  algorithms: many(algorithms),
}));

export type Case = typeof cases.$inferSelect;

export const algorithms = sqliteTable("algorithms", {
  id: text("id").primaryKey(),
  rotations: text("rotations").notNull(),
  mnemonic: text("rotations_mnemonic"),
  description: text("description"),
  appendSetup: text("append_setup"),
  caseId: text("case_id")
    .notNull()
    .references(() => cases.id),
  isMain: integer("is_main", { mode: "boolean" }).default(false),
});

export const algorithmsRelations = relations(algorithms, ({ one }) => ({
  case: one(cases, {
    fields: [algorithms.caseId],
    references: [cases.id],
  }),
}));

export type Algorithm = typeof algorithms.$inferSelect;
