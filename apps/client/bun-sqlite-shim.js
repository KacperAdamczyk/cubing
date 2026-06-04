// Shim for `bun:sqlite` in the Cloudflare Worker bundle.
//
// All DB access happens at build/prerender time (under Bun), where the real
// `bun:sqlite` is used. The deployed Worker only serves prerendered static
// assets and never opens a database — but wrangler/esbuild still has to *bundle*
// the (dead) `db` import that the prerender remote functions pull in, and
// workerd has no `bun:sqlite`. This shim satisfies the bundler and is written to
// be crash-proof (no-ops returning empty results) on the off chance the module
// is evaluated at Worker startup; its query methods are never actually reached.
const emptyStatement = {
	all: () => [],
	get: () => undefined,
	values: () => [],
	run: () => ({ changes: 0, lastInsertRowid: 0 }),
	finalize: () => {}
};

export class Database {
	constructor() {}
	query() {
		return emptyStatement;
	}
	prepare() {
		return emptyStatement;
	}
	run() {}
	exec() {}
	close() {}
}

export default Database;
