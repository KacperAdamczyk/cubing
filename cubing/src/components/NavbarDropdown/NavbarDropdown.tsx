"use client";
import type { FC } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { NavbarItem } from "@nextui-org/navbar";
import { FaChevronDown } from "react-icons/fa6";
import type { InferEntrySchema } from "astro:content";

interface Props {
  sets: InferEntrySchema<"sets">[];
}

export const NavbarDropdown: FC<Props> = ({ sets }) => {
  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Button
            disableRipple
            endContent={<FaChevronDown />}
            radius="sm"
            variant="light"
          >
            Algorithms
          </Button>
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label="Algorithms sets"
        className="w-[200px]"
        itemClasses={{
          base: "gap-4",
        }}
      >
        {sets.map((set) => (
          <DropdownItem as="a" key={set.id} href={`/${set.id}`}>
            {set.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
