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

interface INavBar {
  permLevel: string
}

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 font-bold transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
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
      className="flex items-center justify-center sticky top-0 bg-white z-50 py-2 border-b border-zinc-200"
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
          <div className="flex-col menu w-80 min-h-full py-4 px-4 bg-white border-r border-zinc-200">
          <div className="row flex items-center gap-4 mt-4">
            {/* <i className="ri-user-line text-[26px]"></i> */}
            <div className="info">
              <CardTitle>Usuário logado: {props.permLevel === "admin" ? "admin" : "user"}</CardTitle>
            </div>
          </div>
          <div className="mt-8">
          <AlertDialog>
  <AlertDialogTrigger>
  <Button type="button" className="text-[13px] p-0 h-auto border-0 shadow-none bg-transparent hover:bg-transparent text-red-500 hover:underline" variant="destructive">
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

        {props.permLevel === "admin"
        ? <NavigationMenu className="hidden md:inline">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/home" legacyBehavior passHref>
              <NavigationMenuLink
                style={{
                  ["color" as any]: `${
                    pathName === "/home" ? "#000" : "#CBD5E1"
                  }`,
                  ["backgroundColor" as any]: `${
                    pathName === "/home" ? "" : "transparent"
                  }`,
                }}
                className={`${navigationMenuTriggerStyle()} ${pathName === "/home" ? "" : ""} bg-transparent hover:bg-transparent hover:bg-text-slate-300 transition-colors hover:text-green-400 focus:outline-none`}
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
                    pathName === "/report" ? "#000" : "#CBD5E1"
                  }`,
                  ["backgroundColor" as any]: `${
                    pathName === "/report" ? "#29292A" : "transparent"
                  }`,
                }}
                className={`${navigationMenuTriggerStyle()} h-8 py-1 bg-transparent hover:bg-transparent transition-colors text-slate-300 hover:text-green-400 focus:outline-none`}
              >
                Relatório
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu> 
      : ''
      }

        {props.permLevel === "admin"
        ? <div className="flex items-center gap-4">
            <AddStudent />
            <AddMeal />
          </div>
        : <div></div>
      }

      </div>
    </nav>
  );
};

export default NavBar;





// defaultValues: {
//   name: selectedStudent?.name,
//   email: "",
//   behavior: "",
//   pequenoAlmoco: lastMeal?.pequeno_almoco,
//   almoco1: lastMeal?.almoco1,
//   almoco2: lastMeal?.almoco2,
//   sobremesa: lastMeal?.sobremesa,
//   lanche: lastMeal?.lanche,
//   porcaoPequenoAlmoco: "",
//   porcaoAlmoco1: "",
//   porcaoAlmoco2: "",
//   porcaoSobremesa: "",
//   porcaoLanche: "",
//   fezes: "",
//   vomitos: "",
//   febres: "",
//   description: ""
// },