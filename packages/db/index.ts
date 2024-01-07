import { drizzle, type BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./schema";

let database: BunSQLiteDatabase<typeof schema> | undefined;
export let sqlite: Database | undefined;
export const db = () => {
  if (!database) {
    sqlite = new Database("database.db");
    database = drizzle(sqlite, { schema, logger: true });
  }

  return database;
};
