import type { FC, PropsWithChildren } from "react";
import { AppSidebar, type Set } from "@/layouts/AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Breadcrumbs } from "@/layouts/Breadcrumbs";

interface AppLayoutProps {
  sets: Set[];
  routePattern: string;
  pathname: string;
}

export const AppLayout: FC<PropsWithChildren<AppLayoutProps>> = ({
  sets,
  routePattern,
  pathname,
  children,
}) => {
  return (
    <SidebarProvider>
      <AppSidebar sets={sets} pathname={pathname} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumbs routePattern={routePattern} pathname={pathname} />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
