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
import type { Set } from "@repo/db";
import { FaChevronDown } from "react-icons/fa6";

interface Props {
  sets: Set[];
}

export const NavbarDropdown: FC<Props> = ({ sets }) => {
  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Button
            disableRipple
            // className="p-0 bg-transparent data-[hover=true]:bg-transparent"
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
          <DropdownItem key={set.id} href={`/${set.id}`}>
            {set.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
