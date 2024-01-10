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
import { getSets } from "@/queries/getSets";

export const Navbar: FC = async () => {
  const sets = await getSets();

  return (
    <NextUINavbar isBordered>
      <NavbarBrand>
        <PiCubeTransparentFill size={32} />
        <p className="font-bold text-inherit">Rubik's Algorithms</p>
      </NavbarBrand>
      <NavbarContent className="gap-4" justify="center">
        <NavbarDropdown sets={sets} />
        <NavbarItem>
          <Link href="#" aria-current="page">
            Scrambles
          </Link>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};
