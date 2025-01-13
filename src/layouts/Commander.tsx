import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import type { InferEntrySchema } from "astro:content";
import { useEffect, useState, type FC } from "react";

export type Case = InferEntrySchema<"cases"> & {
  set: InferEntrySchema<"sets">;
  subset: InferEntrySchema<"subsets">;
};

interface CommanderProps {
  cases: Case[];
}

interface CommanderEntry {
  name: string;
  href: string;
}

const getEntries = (cases: Case[]) => {
  const setEntries = new Map<string, CommanderEntry>();
  const subsetEntries = new Map<string, CommanderEntry>();
  const caseEntries = new Map<string, CommanderEntry>();

  for (const c of cases) {
    setEntries.set(c.set.id, {
      name: c.set.name,
      href: `/${c.set.id}`,
    });
    subsetEntries.set(c.subset.id, {
      name: c.subset.name,
      href: `/${c.set.id}/${c.subset.id}`,
    });
    caseEntries.set(c.id, {
      name: c.name,
      href: `/${c.set.id}/${c.subset.id}/${c.id}`,
    });
  }

  return { setEntries, subsetEntries, caseEntries };
};

export const Commander: FC<CommanderProps> = ({ cases }) => {
  const [open, setOpen] = useState(false);
  const { setEntries, subsetEntries, caseEntries } = getEntries(cases);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64",
        )}
        onClick={() => setOpen(true)}
      >
        <span className="inline-flex">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Sets">
            {setEntries.values().map((entry) => (
              <CommandItem key={entry.href} asChild>
                <a href={entry.href}>{entry.name}</a>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Subsets">
            {subsetEntries.values().map((entry) => (
              <CommandItem key={entry.href} asChild>
                <a href={entry.href}>{entry.name}</a>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Cases">
            {caseEntries.values().map((entry) => (
              <CommandItem key={entry.href} asChild>
                <a href={entry.href}>{entry.name}</a>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
