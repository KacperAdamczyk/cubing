import {
  type BetterSQLite3Database,
  drizzle,
} from "drizzle-orm/better-sqlite3";
import Database, { type Database as DatabaseType } from "better-sqlite3";
import { globSync } from "glob";
import * as schema from "./schema";

import DATABASE from "./database.db";

let database: BetterSQLite3Database<typeof schema> | undefined;
export let sqlite: DatabaseType | undefined;
export const db = () => {
  if (!database) {
    sqlite = new Database(Buffer.from(DATABASE), { readonly: true });
    database = drizzle(sqlite, {
      schema,
      logger: true,
    });
  }

  return database;
};

export type { Set } from "./schema";
