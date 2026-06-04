import { describe, expect, it } from 'vitest';
import { getBreadcrumbs } from './breadcrumbs';
import type { SidebarSet } from './types';

const tree: SidebarSet[] = [
	{
		id: 'OLL',
		name: 'OLL',
		previewAlgorithm: '',
		cubeId: '3x3',
		viewType: 'OLL',
		subsets: [
			{
				id: 'Oriented-Edges',
				name: 'Oriented Edges',
				previewAlgorithm: '',
				setId: 'OLL',
				cases: [{ id: 'OLL-21', name: 'Cross' }]
			}
		]
	}
];

describe('getBreadcrumbs', () => {
	it('always starts with the Algorithms root', () => {
		expect(getBreadcrumbs(tree, {})).toEqual([{ name: 'Algorithms', href: '/' }]);
	});

	it('builds nested crumbs for set/subset/case from the tree', () => {
		expect(
			getBreadcrumbs(tree, { setId: 'OLL', subsetId: 'Oriented-Edges', caseId: 'OLL-21' })
		).toEqual([
			{ name: 'Algorithms', href: '/' },
			{ name: 'OLL', href: '/OLL' },
			{ name: 'Oriented Edges', href: '/OLL/Oriented-Edges' },
			{ name: 'Cross', href: '/OLL/Oriented-Edges/OLL-21' }
		]);
	});
});
