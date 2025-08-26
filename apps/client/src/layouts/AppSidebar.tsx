import { GalleryVerticalEnd } from "lucide-react";

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
import { SearchForm } from "@/layouts/SearchForm";
import { useState, type ComponentProps, type FC } from "react";
import type { InferEntrySchema } from "astro:content";

type Case = InferEntrySchema<"cases">;
type Subset = InferEntrySchema<"subsets"> & { cases: Case[] };
export type Set = InferEntrySchema<"sets"> & { subsets: Subset[] };

interface AppSidebarProps extends ComponentProps<typeof Sidebar> {
	sets: Set[];
	pathname: string;
}

export const AppSidebar: FC<AppSidebarProps> = ({
	sets,
	pathname,
	...props
}) => {
	const [query, setQuery] = useState("");
	const filteredSets = sets
		.map((set) => {
			const subsets = set.subsets.map((subset) => {
				if (subset.name.toLowerCase().includes(query.toLowerCase()))
					return subset;

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
		})
		.filter((set) => set.subsets.length > 0);

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="/">
								<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
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
				{filteredSets.map((set) => (
					<SidebarGroup key={set.id}>
						<SidebarGroupLabel asChild>
							<a href={`/${set.id}`}>{set.name}</a>
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{set.subsets.map((subset) => {
									const subsetHref = `/${set.id}/${subset.id}`;

									return (
										<SidebarMenuItem key={subset.id}>
											<SidebarMenuButton
												asChild
												isActive={pathname === subsetHref}
											>
												<a href={`/${set.id}/${subset.id}`}>{subset.name}</a>
											</SidebarMenuButton>
											<SidebarMenuSub>
												{subset.cases.map((currentCase) => {
													const caseHref = `${subsetHref}/${currentCase.id}`;

													return (
														<SidebarMenuSubItem key={currentCase.id}>
															<SidebarMenuSubButton
																asChild
																isActive={pathname === caseHref}
															>
																<a href={caseHref}>{currentCase.name}</a>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													);
												})}
											</SidebarMenuSub>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
};
