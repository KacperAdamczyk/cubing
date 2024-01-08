import {
  type BetterSQLite3Database,
  drizzle,
} from "drizzle-orm/better-sqlite3";
import Database, { type Database as DatabaseType } from "better-sqlite3";
import * as schema from "./schema";

import packageJson from "./package.json";

const fileName = "database.db";
const dbPath = `./node_modules/${packageJson.name}/${fileName}`;
let database: BetterSQLite3Database<typeof schema> | undefined;
export let sqlite: DatabaseType | undefined;
export const db = () => {
  if (!database) {
    sqlite = new Database(dbPath, { readonly: true });
    database = drizzle(sqlite, {
      schema,
      logger: true,
    });
  }

  return database;
};

export type { Category } from "./schema";
