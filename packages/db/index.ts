import { drizzle } from "drizzle-orm/bun-sqlite";
// @ts-expect-error
import database from "./db.sqlite" with { embed: "true", type: "sqlite" };
import * as schema from "./schema";
import { relations } from "./schema";

export const db = drizzle(database, {
	schema,
	relations,
	casing: "snake_case",
});

export * from "./schema";
