import { pickerPath, sessionPath } from "$lib/training/selection";
import type { Breadcrumb, SidebarCube } from "./types";

/** The part of the current URL the crumbs depend on (`search` carries a training selection). */
export interface CrumbLocation {
	pathname: string;
	search: string;
}

export const getBreadcrumbs = (
	tree: SidebarCube[],
	params: Record<string, string>,
	location?: CrumbLocation,
): Breadcrumb[] => {
	const crumbs: Breadcrumb[] = [{ name: "Algorithms", href: "/" }];

	// The trainer lives outside the catalogue hierarchy; its crumbs keep the
	// selection in the query so going "up" from a session lands on the picker
	// with the same cases ticked.
	if (location?.pathname === pickerPath || location?.pathname === sessionPath) {
		crumbs.push({ name: "Training", href: `${pickerPath}${location.search}` });
		if (location.pathname === sessionPath) {
			crumbs.push({ name: "Session", href: `${sessionPath}${location.search}` });
		}
		return crumbs;
	}

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
