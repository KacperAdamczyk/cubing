import {drizzle} from 'drizzle-orm/bun-sql';
// @ts-ignore
import client from "./db.sqlite" with {type: "sqlite", embed: "true"};

export const db = drizzle({client});

export * from './schema';