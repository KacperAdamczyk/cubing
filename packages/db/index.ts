import {drizzle} from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";

const dbPath = Bun.resolveSync("../db.sqlite", import.meta.dirname);
export const db = drizzle(dbPath, {schema, casing: "snake_case"});

export * from "./schema";
