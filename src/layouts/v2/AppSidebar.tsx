import { GalleryVerticalEnd, Minus, Plus } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SearchForm } from "@/layouts/v2/SearchForm";
import { useState, type ComponentProps, type FC } from "react";
import type { InferEntrySchema } from "astro:content";

type Case = InferEntrySchema<"cases">;
type Subset = InferEntrySchema<"subsets"> & { cases: Case[] };
export type Set = InferEntrySchema<"sets"> & { subsets: Subset[] };

interface AppSidebarProps extends ComponentProps<typeof Sidebar> {
  sets: Set[];
}

export const AppSidebar: FC<AppSidebarProps> = ({ sets, ...props }) => {
  const [query, setQuery] = useState("");
  const filteredSets = sets
    .map((set) => {
      const subsets = set.subsets.map((subset) => {
        const cases = subset.cases.filter((c) =>
          c.name.toLowerCase().includes(query.toLowerCase()),
        );
        return { ...subset, cases };
      });
      return { ...set, subsets };
    })
    .map((set) => {
      const subsets = set.subsets.filter((subset) => subset.cases.length > 0);

      return { ...set, subsets };
    });

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Algorithms</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm query={query} setQuery={setQuery} />
      </SidebarHeader>
      <SidebarContent>
        {filteredSets.map(({ id, name, subsets }) => (
          <SidebarGroup key={id}>
            <SidebarGroupLabel>{name}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {subsets.map(({ id, name, cases }) => (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href={"#"}>{name}</a>
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      {cases.map(({ id, name }) => (
                        <SidebarMenuSubItem key={id}>
                          <SidebarMenuSubButton
                            asChild
                            // isActive={item.isActive}
                          >
                            <a href={"#"}>{name}</a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
