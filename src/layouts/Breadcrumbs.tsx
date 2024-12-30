import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbItem,
} from "@/components/ui/breadcrumb";
import { Fragment, type FC } from "react";

interface BreadcrumbEntry {
  name: string;
  href: string;
}

const getBreadcrumbs = (
  routePattern: string,
  pathname: string,
): BreadcrumbEntry[] => {
  const entries: BreadcrumbEntry[] = [{ name: "Algorithms", href: "/" }];
  const parts = routePattern.split("/").filter(Boolean);
  const path = pathname.split("/").filter(Boolean);

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const href = `/${path.slice(0, i + 1).join("/")}`;
    const name = path.at(i) || part;

    entries.push({ name, href });
  }

  return entries;
};

interface BreadcrumbsProps {
  routePattern: string;
  pathname: string;
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({
  routePattern,
  pathname,
}) => {
  const parts = getBreadcrumbs(routePattern, pathname);
  const links = parts.slice(0, -1);
  const active = parts.at(-1);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {links.map((link) => (
          <Fragment key={link.href}>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={link.href}>{link.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </Fragment>
        ))}
        {active && (
          <Fragment key="active">
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{active.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </Fragment>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
