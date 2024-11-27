import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { drizzle } from "drizzle-orm/bun-sqlite";
import Database from "bun:sqlite";
import * as schema from "./schema";

const sqlite = new Database("database.db");
const db = drizzle(sqlite, { schema, logger: true });
migrate(db, { migrationsFolder: "drizzle" });

sqlite.close();
