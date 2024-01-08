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
const dbPath = `**/node_modules/${packageJson.name}/${fileName}`;
console.log(process.cwd());
fs.readdirSync("./").forEach((file) => {
  console.log(file);
});
const matches = globSync(dbPath);

if (matches.length === 0) {
  throw new Error(`Could not find database file matching: ${dbPath}`);
} else if (matches.length > 1) {
  throw new Error(
    `Found multiple database files: ${matches}, matching: ${dbPath}`
  );
}

const dbFile = matches[0]!;

let database: BetterSQLite3Database<typeof schema> | undefined;
export let sqlite: DatabaseType | undefined;
export const db = () => {
  if (!database) {
    sqlite = new Database(dbFile, { readonly: true });
    database = drizzle(sqlite, {
      schema,
      logger: true,
    });
  }

  return database;
};

export type { Category } from "./schema";
