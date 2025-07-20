import type { BreadcrumbEntry } from "@/layouts/Breadcrumbs";

interface BreadcrumbEntity {
  id: string;
  name: string;
}

interface GetBreadcrumbsParams {
  set?: BreadcrumbEntity;
  subset?: BreadcrumbEntity;
  case?: BreadcrumbEntity;
}

export const getBreadcrumbs = ({
  set,
  subset,
  case: c,
}: GetBreadcrumbsParams = {}): BreadcrumbEntry[] => {
  const breadcrumbs: BreadcrumbEntry[] = [{ name: "Algorithms", href: "/" }];

  if (set) {
    breadcrumbs.push({
      name: set.name,
      href: `/${set.id}`,
    });
  }

  if (set && subset) {
    breadcrumbs.push({
      name: subset.name,
      href: `/${set.id}/${subset.id}`,
    });
  }

  if (set && subset && c) {
    breadcrumbs.push({
      name: c.name,
      href: `/${set.id}/${subset.id}/${c.id}`,
    });
  }

  return breadcrumbs;
};
