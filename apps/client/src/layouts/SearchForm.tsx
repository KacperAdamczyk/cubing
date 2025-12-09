import { Search } from "lucide-react";
import type { FC } from "react";
import { Label } from "@/components/ui/label";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarInput,
} from "@/components/ui/sidebar";

interface SearchFormProps {
	query: string;
	setQuery: (query: string) => void;
}

export const SearchForm: FC<SearchFormProps> = ({ query, setQuery }) => {
	return (
		<SidebarGroup className="py-0">
			<SidebarGroupContent className="relative">
				<Label htmlFor="search" className="sr-only">
					Search
				</Label>
				<SidebarInput
					id="search"
					placeholder="Search for algs"
					className="pl-8"
					value={query}
					onChange={(event) => setQuery(event.target.value)}
				/>
				<Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
			</SidebarGroupContent>
		</SidebarGroup>
	);
};
