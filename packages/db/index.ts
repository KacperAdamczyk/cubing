import { drizzle } from "drizzle-orm/bun-sqlite";
// @ts-expect-error
import database from "./db.sqlite" with { embed: "true", type: "sqlite" };
import { relations } from "./relations";
import * as schema from "./schema";

export const db = drizzle(database, {
	relations,
	casing: "snake_case",
});

export * from "./schema";
