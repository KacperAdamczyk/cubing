import {
  type BetterSQLite3Database,
  drizzle,
} from "drizzle-orm/better-sqlite3";
import Database, { type Database as DatabaseType } from "better-sqlite3";
import * as schema from "@/schema";
import { resolve } from "node:path";

import { name } from "package.json";

const dbFilename = "database.db";
let nodeModulesPath = "./node_modules";

export const setNodeModulesPath = (path: string) => {
  nodeModulesPath = path;
};

let database: BetterSQLite3Database<typeof schema> | undefined;
export let sqlite: DatabaseType | undefined;
export const db = () => {
  if (!database) {
    sqlite = new Database(resolve(nodeModulesPath, name, dbFilename), {
      readonly: true,
    });
    database = drizzle(sqlite, {
      schema,
      logger: true,
    });
  }

  return database;
};

export { CaseViewTypes } from "@/schema";
export type * from "@/schema";
