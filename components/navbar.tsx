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
import { Create } from "./create";

interface INavBar {
  permLevel: string
}

const navigationMenuTriggerStyle = cva(
  "text-[16px] font-medium inline-flex h-9 w-full items-center rounded-md px-4 py-2 transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
);

const NavBar: React.FC<INavBar> = (props: INavBar) => {

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
      id="navbar"
      className="flex items-center justify-center sticky top-0 bg-white z-50 py-3 border-b border-zinc-200"
    >
      <div className="drawer w-full max-w-[1200px] px-4 flex items-center justify-between">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex items-center gap-4">
          <label
            htmlFor="my-drawer"
            className="py-1 px-3 bg-white text-black hover:bg-gray-100 hover:cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-zinc-200"
          >
            <i className="ri-menu-line text-[17px] font-normal"></i>
          </label>

          <Link href="/">
            <Image src="https://i.ibb.co/H4Wvchg/ofraldario.webp" width={140} height={25} alt="Fraldario Logo" />
          </Link>
        </div>
        <div className="drawer-side z-20">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="flex-col menu w-80 min-h-full py-4 px-4 bg-white border-r border-zinc-200">
          <div className="row flex items-center gap-4 mt-4">
            {/* <i className="ri-user-line text-[26px]"></i> */}
            <div className="info px-3">
              <CardTitle className="text-[16px]">{props.permLevel === "admin" ? "admin" : "user"}</CardTitle>
            </div>
          </div>


<div className="flex flex-col lg:hidden mt-8 gap-2">
  <Link href="/home" className={`${pathName === '/home' ? 'bg-[#f9f9f9] text-[#126918] font-semibold' : ''} text-[14px] font-medium inline-flex h-9 w-full items-center rounded-md px-4 py-2 transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50`}>
  <i className="ri-home-2-line mr-2 text-[19px]"></i>
                Início
            </Link>

            <Link href="/report" className={`${pathName === '/report' ? 'bg-[#f9f9f9] text-[#126918]' : ''} text-[14px] font-medium inline-flex h-9 w-full items-center rounded-md px-4 py-2 transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50`}>
            <i className="ri-article-line mr-2 text-[19px]"></i>
                Relatório
            </Link>

            <Link href="/students" className={`${pathName === '/students' ? 'bg-[#f9f9f9] text-[#126918]' : ''} text-[14px] font-medium inline-flex h-9 w-full items-center rounded-md px-4 py-2 transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50`}>
            <i className="ri-group-line mr-2 text-[19px]"></i>
            Alunos
          </Link>
</div>

<div className="mt-8">
          <AlertDialog>
  <AlertDialogTrigger>
  <Button type="button" className="text-[13px] px-3 h-auto border-0 shadow-none bg-transparent hover:bg-transparent text-red-500 hover:underline" variant="destructive">
                      <i className="ri-logout-box-line mr-2 text-[18px] text-red-500"></i>
                      Terminar sessão
                    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle className="text-[16px]">Pretende mesmo sair?</AlertDialogTitle>
      <AlertDialogDescription className="text-[13px]">
        Ao confirmar, será redireccionado à página de início de sessão.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter className="mt-4">
      <AlertDialogCancel className="text-[13px]">Cancelar</AlertDialogCancel>
      <AlertDialogAction onClick={() => sessionHandler()} className="text-[13px] bg-red-600 hover:bg-red-500">Sim, desejo sair</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
          </div>
          </div>
        </div>

        <NavigationMenu className="hidden lg:inline">
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
                className={`${navigationMenuTriggerStyle()} ${pathName === "/home" ? "font-semibold" : ""} bg-transparent hover:bg-transparent hover:bg-text-slate-300 transition-colors hover:text-green-400 focus:outline-none`}
              >
                Início
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
                className={`${navigationMenuTriggerStyle()} ${pathName === "/report" ? "font-semibold" : ""} bg-transparent hover:bg-transparent hover:bg-text-slate-300 transition-colors hover:text-green-400 focus:outline-none`}
              >
                Relatório
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
            className={`${navigationMenuTriggerStyle()} ${pathName === "/students" ? "font-semibold" : ""} bg-transparent hover:bg-transparent hover:bg-text-slate-300 transition-colors hover:text-green-400 focus:outline-none`}
          >
            Alunos
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem> : ''}
        </NavigationMenuList>
      </NavigationMenu> 

        {props.permLevel === "admin"
        ? <div className="flex items-center gap-2">
            {/* <AddStudent />
            <AddMeal /> */}
            <Create />
            {/* <Button variant="outline">Criar</Button> */}
          </div>
        : <div></div>
      }

      </div>
    </nav>
  );
};

export default NavBar;
