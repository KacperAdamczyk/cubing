import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";
import { relations } from "./schema";

// @ts-expect-error
import database from "./db.sqlite" with { type: "sqlite", embed: "true" };

export const db = drizzle(database, { 
	schema, 
	relations,
	casing: "snake_case" 
});

export * from "./schema";
