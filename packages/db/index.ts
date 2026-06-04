import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { relations } from "./relations";

// dist/index.js → ../db.sqlite resolves to the committed packages/db/db.sqlite.
const client = new Database(new URL("../db.sqlite", import.meta.url).pathname, {
	readonly: true,
});

export const db = drizzle({ client, relations });

export * from "./schema";
