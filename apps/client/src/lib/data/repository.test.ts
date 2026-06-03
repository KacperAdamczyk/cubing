import { describe, expect, it } from 'vitest';
import {
	getAllCases,
	getCase,
	getSetCases,
	getSets,
	getSidebarTree,
	getSubsetCases
} from './repository';

describe('repository', () => {
	it('returns all sets', () => {
		expect(getSets().map((s) => s.id).sort()).toEqual(['F2L', 'OLL', 'PLL']);
	});

	it('assembles a case with resolved context and the default algorithm first', () => {
		expect(getAllCases()).toHaveLength(29);

		const oll21 = getCase('OLL-21');
		expect(oll21).toBeDefined();
		expect(oll21!.viewType).toBe('OLL'); // inherited from its set
		expect(oll21!.subset.id).toBe('Oriented-Edges');
		expect(oll21!.set.id).toBe('OLL');
		expect(oll21!.algorithms[0].id).toBe('OLL-21__0');
		expect(oll21!.algorithms.length).toBeGreaterThan(0);
	});

	it('groups cases by set and subset consistently', () => {
		const setTotal = getSets().reduce((n, s) => n + getSetCases(s.id).length, 0);
		expect(setTotal).toBe(29);
		expect(getSubsetCases('Oriented-Edges').every((c) => c.subset.id === 'Oriented-Edges')).toBe(
			true
		);
	});

	it('builds a sidebar tree with nested subsets and cases', () => {
		const tree = getSidebarTree();
		expect(tree.map((s) => s.id).sort()).toEqual(['F2L', 'OLL', 'PLL']);
		const oll = tree.find((s) => s.id === 'OLL')!;
		expect(oll.subsets.length).toBeGreaterThan(0);
		expect(oll.subsets[0].cases.length).toBeGreaterThan(0);
	});
});
