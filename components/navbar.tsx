"use client";

import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import links from "@/lib/navData";
import ListItem from "./ListItem";
import ProjectImage from "@/assets/Logo_of_Twitter.svg.png";
import Image from "next/image";

import Link from "next/link";
import { cva } from "class-variance-authority";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { AddUser } from "./adduser";

interface INavBar {
  permLevel: string
}

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-[13px] uppercase font-semibold transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
);

const NavBar: React.FC<INavBar> = (props: INavBar) => {
  const pathName = usePathname();

  return (
    <nav
      id="navbar"
      className="flex items-center sticky top-0 bg-white z-50 py-3 border-b border-zinc-200"
    >
      <div className="drawer flex items-center justify-between px-4 lg:px-20">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex items-center gap-4">
          <label
            htmlFor="my-drawer"
            className="py-1 px-3 bg-white text-black hover:bg-gray-100 hover:cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-zinc-200"
          >
            <i className="ri-menu-line text-[18px] font-normal"></i>
          </label>

          <a className="text-white font-bold text-[16px] flex items-center gap-2">
            Fraldario
          </a>
        </div>
        <div className="drawer-side z-20">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-white border-r border-zinc-300 text-zinc-200">
            <li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>
          </ul>
        </div>
        <NavigationMenu className="hidden md:inline">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink
                  style={{
                    ["color" as any]: `${
                      pathName === "/home" ? "#000" : "#CBD5E1"
                    }`,
                    ["backgroundColor" as any]: `${
                      pathName === "/home" ? "" : "transparent"
                    }`,
                  }}
                  className={`${navigationMenuTriggerStyle()} ${pathName === "/home" ? "underline" : ""} bg-transparent hover:bg-text-slate-300 transition-colors hover:text-green-400 focus:outline-none focus:text-slate-300 focus:bg-zinc-800`}
                >
                  Início
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/portfolio" legacyBehavior passHref>
                <NavigationMenuLink
                  style={{
                    ["color" as any]: `${
                      pathName === "/portfolio" ? "#018bff" : "#CBD5E1"
                    }`,
                    ["backgroundColor" as any]: `${
                      pathName === "/portfolio" ? "#29292A" : "transparent"
                    }`,
                  }}
                  className={`${navigationMenuTriggerStyle()} h-8 py-1 bg-transparent hover:bg-transparent transition-colors text-slate-300 hover:text-green-400 focus:outline-none`}
                >
                  Turmas
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {props.permLevel === "admin"
        ? <div className="flex items-center gap-4">
            <AddUser />
          </div>
        : <div></div>
      }

      </div>
    </nav>
  );
};

export default NavBar;
