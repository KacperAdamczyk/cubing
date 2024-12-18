import type { FC } from "react";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { NavbarDropdown } from "@/components/NavbarDropdown";
import { PiCubeTransparentFill } from "react-icons/pi";
import type { InferEntrySchema } from "astro:content";

interface NavbarProps {
  sets: InferEntrySchema<"sets">[];
}

export const Navbar: FC<NavbarProps> = ({ sets }) => (
  <NextUINavbar isBordered>
    <NavbarBrand>
      <PiCubeTransparentFill size={32} />
      <Link
        href="/"
        className="ml-1 flex flex-col items-start whitespace-normal text-xs font-bold text-inherit md:text-medium lg:text-xl"
      >
        <span className="hidden sm:inline">Rubik&apos;s Algorithms</span>
        <span className="text-xs">by Kacper Adamczyk</span>
      </Link>
    </NavbarBrand>
    <NavbarContent className="gap-4" justify="center">
      <NavbarDropdown sets={sets} />
    </NavbarContent>
  </NextUINavbar>
);
