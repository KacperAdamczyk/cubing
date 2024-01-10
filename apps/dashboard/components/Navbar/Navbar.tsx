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
import { getCategories } from "@/queries/getCategories";

export const Navbar: FC = async () => {
  const categories = await getCategories();

  return (
    <NextUINavbar isBordered>
      <NavbarBrand>
        <PiCubeTransparentFill size={32} />
        <p className="font-bold text-inherit">Rubik's Algorithms</p>
      </NavbarBrand>
      <NavbarContent className="gap-4" justify="center">
        <NavbarDropdown categories={categories} />
        <NavbarItem>
          <Link href="#" aria-current="page">
            Scrambles
          </Link>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};
