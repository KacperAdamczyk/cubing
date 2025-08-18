import {drizzle} from 'drizzle-orm/bun-sqlite';

const dbPath = Bun.resolveSync("../db.sqlite", import.meta.dirname);
export const db = drizzle(dbPath);
export * from './schema';