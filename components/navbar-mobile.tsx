"use client"

import { cva } from "class-variance-authority";
import { useRouter, usePathname } from "next/navigation";
import { AddStudent } from "./add-student";
import { CardTitle } from "./ui/card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button";
import { endSession } from "@/lib/api";
import { AddMeal } from "./add-meal";
import Link from "next/link";
import Image from "next/image";

interface INavBar {
  permLevel: string
}

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 font-bold transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
);

const NavBarMobile: React.FC<INavBar> = (props: INavBar) => {

  const router = useRouter();
  const pathName = usePathname();

  const sessionHandler = () => {
    const response = endSession()

    if(response !== undefined || !response) {
      router.replace("/")
    }
  }

  return (
    <nav
      className="w-full flex md:hidden items-center fixed bottom-0 bg-white z-50 py-2 border-t border-zinc-200"
    >
        <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/home" legacyBehavior passHref>
              <NavigationMenuLink
                style={{
                  ["color" as any]: `${
                    pathName === "/home" ? "#126918" : "#cccccc"
                  }`,
                  ["backgroundColor" as any]: `${
                    pathName === "/home" ? "" : "transparent"
                  }`,
                }}
                className={`${navigationMenuTriggerStyle()} ${pathName === "/home" ? "" : ""} bg-transparent hover:bg-transparent hover:bg-text-slate-300 transition-colors hover:text-green-400 focus:outline-none`}
              >
                <i className="ri-home-2-line"></i>
                {/* Início */}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/report" legacyBehavior passHref>
              <NavigationMenuLink
                style={{
                  ["color" as any]: `${
                    pathName === "/report" ? "#126918" : "#cccccc"
                  }`,
                  ["backgroundColor" as any]: `${
                    pathName === "/report" ? "" : "transparent"
                  }`,
                }}
                className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-transparent hover:bg-text-slate-300 transition-colors hover:text-green-400 focus:outline-none`}
              >
                <i className="ri-article-line"></i>
                {/* Relatório */}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {props.permLevel === "admin"
        ? <NavigationMenuItem>
        <Link href="/students" legacyBehavior passHref>
          <NavigationMenuLink
            style={{
              ["color" as any]: `${pathName === "/students" ? "#126918" : "#cccccc"
                }`,
              ["backgroundColor" as any]: `${pathName === "/students" ? "" : "transparent"
                }`,
            }}
            className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-transparent hover:bg-text-slate-300 transition-colors hover:text-green-400 focus:outline-none`}
          >
            <i className="ri-group-line"></i>
            {/* Alunos */}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem> : ''}
        </NavigationMenuList>
      </NavigationMenu> 

        {props.permLevel === "admin"
        ? <div className="flex items-center gap-2">
            {/* <AddStudent />
            <AddMeal />
            <Button variant="outline">BroadCast</Button> */}
          </div>
        : <div></div>
      }
    </nav>
  );
};

export default NavBarMobile;
