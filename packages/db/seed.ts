import { Database } from "bun:sqlite";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";
import cubeRows from "../../apps/client/src/lib/data/tables/cube.json";
import setRows from "../../apps/client/src/lib/data/tables/set.json";
import subsetRows from "../../apps/client/src/lib/data/tables/subset.json";
import caseRows from "../../apps/client/src/lib/data/tables/case.json";
import algorithmRows from "../../apps/client/src/lib/data/tables/algorithm.json";

const client = new Database("./db.sqlite");
const db = drizzle({ client });

client.run("PRAGMA foreign_keys = OFF");
db.delete(schema.algorithm).run();
db.delete(schema.case_).run();
db.delete(schema.subset).run();
db.delete(schema.set).run();
db.delete(schema.cube).run();

db.insert(schema.cube).values(cubeRows).run();
db.insert(schema.set).values(setRows).run();
db.insert(schema.subset).values(subsetRows).run();
// Insert cases without the algorithm FK first, then back-fill.
db.insert(schema.case_)
	.values(caseRows.map((c) => ({ ...c, defaultAlgorithmId: null })))
	.run();
db.insert(schema.algorithm).values(algorithmRows).run();
for (const c of caseRows) {
	if (c.defaultAlgorithmId) {
		db.update(schema.case_)
			.set({ defaultAlgorithmId: c.defaultAlgorithmId })
			.where(eq(schema.case_.id, c.id))
			.run();
	}
}

console.log("seeded", {
	cube: db.select().from(schema.cube).all().length,
	set: db.select().from(schema.set).all().length,
	subset: db.select().from(schema.subset).all().length,
	case: db.select().from(schema.case_).all().length,
	algorithm: db.select().from(schema.algorithm).all().length,
});
