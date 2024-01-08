import {
  type BetterSQLite3Database,
  drizzle,
} from "drizzle-orm/better-sqlite3";
import Database, { type Database as DatabaseType } from "better-sqlite3";
import { globSync } from "glob";
import * as schema from "./schema";
import fs from "node:fs";

import packageJson from "./package.json";

const fileName = "database.db";
const rootsToCheck = ["./", "../../"] as const;
const dbPath = `**/node_modules/${packageJson.name}/${fileName}`;
let foundPath: string | undefined;

for (const root of rootsToCheck) {
  const path = globSync(`${root}${dbPath}`).at(0);

  if (path) {
    foundPath = path;
    break;
  }
}

if (!foundPath) {
  throw new Error(`Could not find database file matching: ${dbPath}`);
}

let database: BetterSQLite3Database<typeof schema> | undefined;
export let sqlite: DatabaseType | undefined;
export const db = () => {
  if (!foundPath) {
    throw new Error(`Could not find database file matching: ${dbPath}`);
  }

  if (!database) {
    sqlite = new Database(foundPath, { readonly: true });
    database = drizzle(sqlite, {
      schema,
      logger: true,
    });
  }

  return database;
};

export type { Category } from "./schema";
