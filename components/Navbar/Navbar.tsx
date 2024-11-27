import type { FC } from "react";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import { NavbarDropdown } from "@/components/NavbarDropdown";
import { PiCubeTransparentFill } from "react-icons/pi";
import { getSets } from "@/queries/getSets";

export const Navbar: FC = async () => {
  const sets = await getSets();

  return (
    <NextUINavbar isBordered>
      <NavbarBrand>
        <PiCubeTransparentFill size={32} />
        <Link
          as={NextLink}
          href="/"
          className="text-inherit ml-1 flex flex-col items-start whitespace-normal text-xs font-bold md:text-medium lg:text-xl"
        >
          <span className="hidden sm:inline">Rubik&apos;s Algorithms</span>
          <span className="text-xs">by Kacper Adamczyk</span>
        </Link>
      </NavbarBrand>
      <NavbarContent className="gap-4" justify="center">
        <NavbarDropdown sets={sets} />
        <NavbarItem>
          <Link
            as={NextLink}
            prefetch={false}
            href="/scramble"
            className="text-inherit"
          >
            Scrambles
          </Link>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};
