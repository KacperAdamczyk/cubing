import { BunSQLiteDatabase, drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./schema";

import data from "./database.db";

let database: BunSQLiteDatabase<typeof schema> | undefined;
export let sqlite: Database | undefined;
export const db = () => {
  if (!database) {
    sqlite = Database.deserialize(data, true);
    database = drizzle(sqlite, {
      schema,
      logger: true,
    });
  }

  return database;
};
