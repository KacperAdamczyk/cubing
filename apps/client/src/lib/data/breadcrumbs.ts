import type { Breadcrumb, SidebarCube } from './types';

export const getBreadcrumbs = (
	tree: SidebarCube[],
	params: Record<string, string>
): Breadcrumb[] => {
	const crumbs: Breadcrumb[] = [{ name: 'Algorithms', href: '/' }];

	const cube = params.cubeId ? tree.find((c) => c.id === params.cubeId) : undefined;
	if (!cube) return crumbs;
	crumbs.push({ name: cube.name, href: `/${cube.id}` });

	const set = params.setId ? cube.sets.find((s) => s.id === params.setId) : undefined;
	if (!set) return crumbs;
	crumbs.push({ name: set.name, href: `/${cube.id}/${set.id}` });

	const subset = params.subsetId ? set.subsets.find((s) => s.id === params.subsetId) : undefined;
	if (!subset) return crumbs;
	crumbs.push({ name: subset.name, href: `/${cube.id}/${set.id}/${subset.id}` });

	const c = params.caseId ? subset.cases.find((x) => x.id === params.caseId) : undefined;
	if (!c) return crumbs;
	crumbs.push({ name: c.name, href: `/${cube.id}/${set.id}/${subset.id}/${c.id}` });

	return crumbs;
};
