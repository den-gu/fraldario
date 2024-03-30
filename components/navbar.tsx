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

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
);

const NavBar: React.FC = () => {
  const pathName = usePathname();

  return (
    <nav
      id="navbar"
      className="container flex items-center sticky top-0 bg-[#1C1C1C] z-50 py-1 border-b border-zinc-800"
    >
      <div className="drawer flex items-center justify-between">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex items-center gap-6">
          <label
            htmlFor="my-drawer"
            className="py-1 px-3 bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:cursor-pointer text-zinc-300 inline-flex items-center justify-center whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-2 border-zinc-800"
          >
            <i className="ri-menu-4-line text-[18px] font-normal"></i>
          </label>

          <a className="text-white font-bold text-[16px] flex items-center gap-2">
            <i className="ri-supabase-line text-[20px]"></i>
            Atemporal
          </a>
        </div>
        <div className="drawer-side z-20">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-[#1C1C1C] border-r border-zinc-800 text-zinc-300">
            <li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>
          </ul>
        </div>
        <NavigationMenu className="hidden lg:inline">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink
                  style={{
                    ["color" as any]: `${
                      pathName === "/" ? "#4ADE80" : "#CBD5E1"
                    }`,
                    ["backgroundColor" as any]: `${
                      pathName === "/" ? "#29292A" : "transparent"
                    }`,
                  }}
                  className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-text-slate-300 transition-colors hover:text-green-400 focus:outline-none focus:text-slate-300 focus:bg-zinc-800`}
                >
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                style={{
                  ["color" as any]: `${
                    pathName === "/services" ? "#4ADE80" : "#CBD5E1"
                  }`,
                  ["backgroundColor" as any]: `${
                    pathName === "/services" ? "#29292A" : "transparent"
                  }`,
                }}
              >
                Services
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        {/* <Icons.logo className="h-6 w-6" /> */}
                        {/* <AvatarIcon /> */}
                        {/* <Avatar 
                        source={ProjectImage}
                        size={50}
                         /> */}
                        <Image
                          src={ProjectImage}
                          alt=""
                          quality={100}
                          className="object-contain w-[60px] h-[60px]"
                        />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Atemporal
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Beautifully designed components that you can copy and
                          paste into your apps.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/docs" title="Introduction">
                    Re-usable components built using Radix UI and Tailwind CSS.
                  </ListItem>
                  <ListItem href="/docs/installation" title="Installation">
                    How to install dependencies and structure your app.
                  </ListItem>
                  <ListItem
                    href="/docs/primitives/typography"
                    title="Typography"
                  >
                    Styles for headings, paragraphs, lists...etc
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                style={{
                  ["color" as any]: `${
                    pathName === "/projects" ? "#4ADE80" : "#CBD5E1"
                  }`,
                  ["backgroundColor" as any]: `${
                    pathName === "/projects" ? "#29292A" : "transparent"
                  }`,
                }}
              >
                Projects
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {links.map((link) => (
                    <ListItem
                      key={link.title}
                      title={link.title}
                      href={link.href}
                    >
                      {link.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/portfolio" legacyBehavior passHref>
                <NavigationMenuLink
                  style={{
                    ["color" as any]: `${
                      pathName === "/portfolio" ? "#4ADE80" : "#CBD5E1"
                    }`,
                    ["backgroundColor" as any]: `${
                      pathName === "/portfolio" ? "#29292A" : "transparent"
                    }`,
                  }}
                  className={`${navigationMenuTriggerStyle()} h-8 py-1 bg-transparent hover:bg-transparent transition-colors text-slate-300 hover:text-green-400 focus:outline-none`}
                >
                  Portfolio
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-4">
          <Button
            variant="default"
            className="flex items-center h-8 text-[12px] border-2 border-zinc-600/50 bg-zinc-400/10 hover:bg-zinc-900 font-semibold gap-1 rounded-[5px]"
          >
            <i className="ri-youtube-line text-[14px] font-thin mt-1"></i>
            Learn more
          </Button>
          <Button
            variant="default"
            className="flex items-center h-8 text-[12px] border-2 border-green-500/30 bg-green-900 hover:bg-green-700/10 font-semibold gap-1 rounded-[5px]"
          >
            <i className="ri-arrow-right-s-line text-[14px] font-thin mt-1"></i>
            Hire us
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
