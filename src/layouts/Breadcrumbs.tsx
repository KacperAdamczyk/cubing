import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbItem,
} from "@/components/ui/breadcrumb";
import { Fragment, type FC } from "react";

export interface BreadcrumbEntry {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  breadcrumbs: BreadcrumbEntry[];
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ breadcrumbs }) => {
  const links = breadcrumbs.slice(0, -1);
  const active = breadcrumbs.at(-1);

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
