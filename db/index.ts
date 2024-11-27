import { drizzle } from "drizzle-orm/better-sqlite3";
import Database, { type Database as DatabaseType } from "better-sqlite3";
import * as schema from "@/db/schema";

const database = new Database("./db/database.db");
export const db = drizzle(database, {
  schema,
  logger: true,
});
