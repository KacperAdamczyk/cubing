import { relations } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export type Category = typeof categories.$inferSelect;

export const categoriesRelations = relations(categories, ({ many }) => ({
  groups: many(groups),
}));

export const groups = sqliteTable("groups", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  previewAlgorithm: text("preview_algorithm").notNull(),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
});

export const groupsRelations = relations(groups, ({ one, many }) => ({
  category: one(categories, {
    fields: [groups.categoryId],
    references: [categories.id],
  }),
  cases: many(cases),
}));

export const cases = sqliteTable("cases", {
  id: text("id").primaryKey(),
  name: text("name"),
  setup: text("setup").notNull(),
  groupId: text("group_id")
    .notNull()
    .references(() => groups.id),
});

export const casesRelations = relations(cases, ({ one, many }) => ({
  group: one(groups, {
    fields: [cases.groupId],
    references: [groups.id],
  }),
  algorithms: many(algorithms),
}));

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
