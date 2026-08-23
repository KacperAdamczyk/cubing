import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { relations } from "./relations";

const databasePath = (() => {
	try {
		// dist/index.js → ../db.sqlite resolves to the committed packages/db/db.sqlite.
		return new URL("../db.sqlite", import.meta.url).pathname;
	} catch {
		// No usable `import.meta.url` — the Cloudflare Worker bundle, where
		// `bun:sqlite` is a shim whose Database ignores its arguments and no
		// query ever runs (remote functions serve their prerendered JSON).
		return "db.sqlite";
	}
})();

const client = new Database(databasePath, { readonly: true });

export const db = drizzle({ client, relations });

export * from "./schema";
