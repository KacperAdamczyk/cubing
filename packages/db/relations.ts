import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	cube: {
		sets: r.many.set(),
	},
	set: {
		cube: r.one.cube({
			from: r.set.cubeId,
			to: r.cube.id,
			optional: false,
		}),
		subsets: r.many.subset(),
	},
	subset: {
		set: r.one.set({
			from: r.subset.setId,
			to: r.set.id,
			optional: false,
		}),
		cases: r.many.case_(),
	},
	case_: {
		subset: r.one.subset({
			from: r.case_.subsetId,
			to: r.subset.id,
			optional: false,
		}),
		algorithms: r.many.algorithm(),
	},
	algorithm: {
		case: r.one.case_({
			from: r.algorithm.caseId,
			to: r.case_.id,
			optional: false,
		}),
	},
}));
