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
import type { Category } from "@repo/db";
import { FaChevronDown } from "react-icons/fa6";

interface Props {
  categories: Category[];
}

export const NavbarDropdown: FC<Props> = ({ categories }) => {
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
        aria-label="Algorithms categories"
        className="w-[200px]"
        itemClasses={{
          base: "gap-4",
        }}
      >
        {categories.map((category) => (
          <DropdownItem key={category.id} href={`/${category.id}`}>
            {category.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
