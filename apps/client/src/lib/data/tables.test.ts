import { describe, expect, it } from 'vitest';
import cube from './tables/cube.json';
import set from './tables/set.json';
import subset from './tables/subset.json';
import caseRows from './tables/case.json';
import algorithm from './tables/algorithm.json';

describe('normalized data tables', () => {
	it('has the expected row counts', () => {
		expect(cube).toHaveLength(1);
		expect(set).toHaveLength(3);
		expect(subset).toHaveLength(7);
		expect(caseRows).toHaveLength(29);
		expect(algorithm).toHaveLength(37);
	});

	it('has valid foreign keys and resolvable default algorithms', () => {
		const cubeIds = new Set(cube.map((c) => c.id));
		const setIds = new Set(set.map((s) => s.id));
		const subsetIds = new Set(subset.map((s) => s.id));
		const caseIds = new Set(caseRows.map((c) => c.id));
		const algorithmIds = new Set(algorithm.map((a) => a.id));

		expect(set.every((s) => cubeIds.has(s.cubeId))).toBe(true);
		expect(subset.every((s) => setIds.has(s.setId))).toBe(true);
		expect(caseRows.every((c) => subsetIds.has(c.subsetId))).toBe(true);
		expect(algorithm.every((a) => caseIds.has(a.caseId))).toBe(true);
		expect(
			caseRows.every((c) => c.defaultAlgorithmId !== null && algorithmIds.has(c.defaultAlgorithmId))
		).toBe(true);
	});
});
