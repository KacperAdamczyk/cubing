import type { Breadcrumb } from './types';

interface Entity {
	id: string;
	name: string;
}

interface GetBreadcrumbsParams {
	set?: Entity;
	subset?: Entity;
	case?: Entity;
}

export const getBreadcrumbs = ({
	set,
	subset,
	case: c
}: GetBreadcrumbsParams = {}): Breadcrumb[] => {
	const breadcrumbs: Breadcrumb[] = [{ name: 'Algorithms', href: '/' }];

	if (set) breadcrumbs.push({ name: set.name, href: `/${set.id}` });
	if (set && subset) breadcrumbs.push({ name: subset.name, href: `/${set.id}/${subset.id}` });
	if (set && subset && c)
		breadcrumbs.push({ name: c.name, href: `/${set.id}/${subset.id}/${c.id}` });

	return breadcrumbs;
};
