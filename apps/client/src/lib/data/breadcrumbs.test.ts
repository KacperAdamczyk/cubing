import { describe, expect, it } from 'vitest';
import { getBreadcrumbs } from './breadcrumbs';

describe('getBreadcrumbs', () => {
	it('always starts with the Algorithms root', () => {
		expect(getBreadcrumbs()).toEqual([{ name: 'Algorithms', href: '/' }]);
	});

	it('builds nested crumbs for set/subset/case', () => {
		expect(
			getBreadcrumbs({
				set: { id: 'OLL', name: 'OLL' },
				subset: { id: 'Oriented-Edges', name: 'Oriented Edges' },
				case: { id: 'OLL-21', name: 'Cross' }
			})
		).toEqual([
			{ name: 'Algorithms', href: '/' },
			{ name: 'OLL', href: '/OLL' },
			{ name: 'Oriented Edges', href: '/OLL/Oriented-Edges' },
			{ name: 'Cross', href: '/OLL/Oriented-Edges/OLL-21' }
		]);
	});
});
