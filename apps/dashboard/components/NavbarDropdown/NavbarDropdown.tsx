"use client";
import { Button } from "@nextui-org/button";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@nextui-org/dropdown";
import { NavbarItem } from "@nextui-org/navbar";
import type { Set } from "@repo/db";
import NextLink from "next/link";
import type { FC } from "react";
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
					<DropdownItem as={NextLink} key={set.id} href={`/${set.id}`}>
						{set.name}
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	);
};
