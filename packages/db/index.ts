import {
  type BetterSQLite3Database,
  drizzle,
} from "drizzle-orm/better-sqlite3";
import Database, { type Database as DatabaseType } from "better-sqlite3";
import * as schema from "@/schema";

import DATABASE from "@/database.db";

let database: BetterSQLite3Database<typeof schema>;
export let sqlite: DatabaseType;
export const db = () => {
  if (!database) {
    sqlite = new Database(Buffer.from(DATABASE));
    database = drizzle(sqlite, {
      schema,
      logger: true,
    });
  }

  return database;
};

export { CaseViewTypes } from "@/schema";
export type * from "@/schema";
