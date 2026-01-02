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
		}),
		subsets: r.many.subset(),
	},
	subset: {
		set: r.one.set({
			from: r.subset.setId,
			to: r.set.id,
		}),
		cases: r.many.case_(),
	},
	case_: {
		subset: r.one.subset({
			from: r.case_.subsetId,
			to: r.subset.id,
		}),
		algorithms: r.many.algorithm(),
	},
	algorithm: {
		case: r.one.case_({
			from: r.algorithm.caseId,
			to: r.case_.id,
		}),
	},
}));
