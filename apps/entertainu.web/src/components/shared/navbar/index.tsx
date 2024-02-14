"use client";

import React from "react";

import NextLink from "next/link";

import { ThemeToggle } from "@/components/shared/ThemeToggle";

import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  return (
    <>
      <Navbar shouldHideOnScroll>
        <NavbarBrand as={NextLink} href="/">
          <p className="font-bold text-foreground">Entertainu</p>
        </NavbarBrand>
        <NavbarContent className="hidden gap-4 sm:flex" justify="center">
          <NavbarItem isActive={pathname === "/"}>
            <Link
              as={NextLink}
              color={pathname === "/" ? "primary" : "foreground"}
              href="/"
            >
              Home
            </Link>
          </NavbarItem>
          <NavbarItem isActive={pathname === "/anime"}>
            <Link
              as={NextLink}
              color={pathname === "/anime" ? "primary" : "foreground"}
              href="/anime"
            >
              Anime
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            {/* <Button as={NextLink} color="primary" href="#" variant="flat">
              Sign Up
            </Button> */}
          </NavbarItem>
          <NavbarItem>
            <ThemeToggle />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </>
  );
}
