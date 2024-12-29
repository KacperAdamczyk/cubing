import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar";
import type { FC } from "react";

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
        <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
