import type { FC, PropsWithChildren } from "react";
import { AppSidebar, type Set } from "@/layouts/AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Breadcrumbs, type BreadcrumbEntry } from "@/layouts/Breadcrumbs";
import { Commander, type Case } from "@/layouts/Commander";

interface AppLayoutProps {
  sets: Set[];
  pathname: string;
  breadcrumbs: BreadcrumbEntry[];
  cases: Case[];
}

export const AppLayout: FC<PropsWithChildren<AppLayoutProps>> = ({
  sets,
  pathname,
  breadcrumbs,
  cases,
  children,
}) => (
  <SidebarProvider>
    <AppSidebar sets={sets} pathname={pathname} />
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex flex-1 items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumbs breadcrumbs={breadcrumbs} />
          <div className="ml-auto">
            <Commander cases={cases} />
          </div>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
          {children}
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
);
