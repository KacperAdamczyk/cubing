import { describe, expect, it } from 'vitest';
import {
	getAllCases,
	getCase,
	getCubeCases,
	getCubeSets,
	getCubes,
	getSetCases,
	getSets,
	getSidebarTree,
	getSubsetCases
} from './repository';

describe('repository', () => {
	it('returns the single 3x3 cube with its sets and cases', () => {
		expect(getCubes().map((c) => c.id)).toEqual(['3x3']);
		expect(
			getCubeSets('3x3')
				.map((s) => s.id)
				.sort()
		).toEqual(['F2L', 'OLL', 'PLL']);
		expect(getCubeCases('3x3')).toHaveLength(29);
	});

	it('returns all sets', () => {
		expect(
			getSets()
				.map((s) => s.id)
				.sort()
		).toEqual(['F2L', 'OLL', 'PLL']);
	});

	it('returns a case with its joined subset/set and algorithms', () => {
		expect(getAllCases()).toHaveLength(29);

		const oll21 = getCase('OLL-21');
		expect(oll21).toBeDefined();
		expect(oll21!.subset.set.viewType).toBe('OLL');
		expect(oll21!.subset.set.id).toBe('OLL');
		expect(oll21!.subset.set.cubeId).toBe('3x3');
		expect(oll21!.subset.id).toBe('Oriented-Edges');
		expect(oll21!.defaultAlgorithmId).toBe('OLL-21__0');
		expect(oll21!.algorithms.some((a) => a.id === 'OLL-21__0')).toBe(true);
	});

	it('groups cases by set and subset consistently', () => {
		const setTotal = getSets().reduce((n, s) => n + getSetCases(s.id).length, 0);
		expect(setTotal).toBe(29);
		expect(getSubsetCases('Oriented-Edges').every((c) => c.subset.id === 'Oriented-Edges')).toBe(
			true
		);
	});

	it('builds a cube-rooted sidebar tree', () => {
		const tree = getSidebarTree();
		expect(tree.map((c) => c.id)).toEqual(['3x3']);
		const cube = tree[0];
		expect(cube.sets.map((s) => s.id).sort()).toEqual(['F2L', 'OLL', 'PLL']);
		const oll = cube.sets.find((s) => s.id === 'OLL')!;
		expect(oll.subsets.length).toBeGreaterThan(0);
		expect(oll.subsets[0].cases.length).toBeGreaterThan(0);
	});
});
