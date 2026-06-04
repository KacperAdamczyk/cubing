import { describe, expect, it } from 'vitest';
import { isAlgorithmCorrect } from './isAlgorithmCorrect';

describe('isAlgorithmCorrect', () => {
	it('treats a solved cube as correct for PLL', () => {
		expect(isAlgorithmCorrect('', '', 'PLL')).toBe(true);
	});

	it('treats a disturbed cube as incorrect for PLL', () => {
		expect(isAlgorithmCorrect('R', '', 'PLL')).toBe(false);
	});

	it('treats a uniform top layer as correct for OLL', () => {
		expect(isAlgorithmCorrect('', '', 'OLL')).toBe(true);
	});

	it('treats a broken top layer as incorrect for OLL', () => {
		expect(isAlgorithmCorrect('R', '', 'OLL')).toBe(false);
	});
});
