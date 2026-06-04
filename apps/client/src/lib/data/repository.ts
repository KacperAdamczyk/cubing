import algorithmTable from './tables/algorithm.json';
import caseTable from './tables/case.json';
import setTable from './tables/set.json';
import subsetTable from './tables/subset.json';
import type { Algorithm, Case, CaseWithContext, Set, SidebarSet, Subset } from './types';

const sets = setTable as unknown as Set[];
const subsets = subsetTable as unknown as Subset[];
const cases = caseTable as unknown as Case[];
const algorithms = algorithmTable as unknown as Algorithm[];

const setsById = new Map(sets.map((s) => [s.id, s]));
const subsetsById = new Map(subsets.map((s) => [s.id, s]));

const subsetsBySet = new Map<string, Subset[]>();
for (const s of subsets) {
	const list = subsetsBySet.get(s.setId) ?? [];
	list.push(s);
	subsetsBySet.set(s.setId, list);
}

const casesBySubset = new Map<string, Case[]>();
for (const c of cases) {
	const list = casesBySubset.get(c.subsetId) ?? [];
	list.push(c);
	casesBySubset.set(c.subsetId, list);
}

const algorithmsByCase = new Map<string, Algorithm[]>();
for (const a of algorithms) {
	const list = algorithmsByCase.get(a.caseId) ?? [];
	list.push(a);
	algorithmsByCase.set(a.caseId, list);
}

const buildContext = (c: Case): CaseWithContext => {
	const subset = subsetsById.get(c.subsetId);
	if (!subset) throw new Error(`Subset ${c.subsetId} not found for case ${c.id}`);
	const set = setsById.get(subset.setId);
	if (!set) throw new Error(`Set ${subset.setId} not found for subset ${subset.id}`);

	const list = algorithmsByCase.get(c.id) ?? [];
	const main = list.filter((a) => a.id === c.defaultAlgorithmId);
	const rest = list.filter((a) => a.id !== c.defaultAlgorithmId);

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

export const getSets = (): Set[] => sets;
export const findSet = (setId: string): Set | undefined => setsById.get(setId);
export const findSubset = (subsetId: string): Subset | undefined => subsetsById.get(subsetId);
export const getSetSubsets = (setId: string): Subset[] => subsetsBySet.get(setId) ?? [];

export const getSubsetCases = (subsetId: string): CaseWithContext[] =>
	(casesBySubset.get(subsetId) ?? []).map(buildContext);

export const getSetCases = (setId: string): CaseWithContext[] =>
	getSetSubsets(setId).flatMap((s) => getSubsetCases(s.id));

export const getAllCases = (): CaseWithContext[] => cases.map(buildContext);

export const getCase = (caseId: string): CaseWithContext | undefined => {
	const found = cases.find((c) => c.id === caseId);
	return found ? buildContext(found) : undefined;
};

export const getSidebarTree = (): SidebarSet[] =>
	sets.map((set) => ({
		...set,
		subsets: getSetSubsets(set.id).map((subset) => ({
			...subset,
			cases: (casesBySubset.get(subset.id) ?? []).map((c) => ({ id: c.id, name: c.name }))
		}))
	}));
