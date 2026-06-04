import { db } from 'db';
import type { Algorithm, Case, CaseWithContext, Set, SidebarSet, Subset } from '$lib/data/types';

// Each case is fetched with its parent subset (+ its set) and its algorithms, so
// the view-model can be assembled without loading unrelated rows.
const caseWith = {
	subset: { with: { set: true } },
	algorithms: true
} as const;

// Drizzle types `one` relations as nullable (it doesn't assume FK presence),
// so guard them — mirroring the previous repository's "not found" errors.
type CaseRow = Case & { subset: (Subset & { set: Set | null }) | null; algorithms: Algorithm[] };

const toCaseWithContext = (c: CaseRow): CaseWithContext => {
	if (!c.subset) throw new Error(`Subset ${c.subsetId} not found for case ${c.id}`);
	const { set, ...subset } = c.subset;
	if (!set) throw new Error(`Set ${subset.setId} not found for subset ${subset.id}`);
	const main = c.algorithms.filter((a) => a.id === c.defaultAlgorithmId);
	const rest = c.algorithms.filter((a) => a.id !== c.defaultAlgorithmId);

	return {
		id: c.id,
		name: c.name,
		setup: c.setup,
		viewType: set.viewType,
		set,
		subset,
		algorithms: [...main, ...rest]
	};
};

export const getSets = (): Set[] => db.query.set.findMany().sync();

export const findSet = (setId: string): Set | undefined =>
	db.query.set.findFirst({ where: { id: setId } }).sync();

export const findSubset = (subsetId: string): Subset | undefined =>
	db.query.subset.findFirst({ where: { id: subsetId } }).sync();

export const getSetSubsets = (setId: string): Subset[] =>
	db.query.subset.findMany({ where: { setId } }).sync();

export const getSubsetCases = (subsetId: string): CaseWithContext[] =>
	db.query.case_.findMany({ where: { subsetId }, with: caseWith }).sync().map(toCaseWithContext);

export const getSetCases = (setId: string): CaseWithContext[] =>
	db.query.case_
		.findMany({ where: { subset: { setId } }, with: caseWith })
		.sync()
		.map(toCaseWithContext);

export const getAllCases = (): CaseWithContext[] =>
	db.query.case_.findMany({ with: caseWith }).sync().map(toCaseWithContext);

export const getCase = (caseId: string): CaseWithContext | undefined => {
	const c = db.query.case_.findFirst({ where: { id: caseId }, with: caseWith }).sync();
	return c ? toCaseWithContext(c) : undefined;
};

export const getSidebarTree = (): SidebarSet[] =>
	db.query.set
		.findMany({ with: { subsets: { with: { cases: { columns: { id: true, name: true } } } } } })
		.sync();
