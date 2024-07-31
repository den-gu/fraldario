import React from 'react'
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
  import { cookies } from "next/headers";

export const EndSession: React.FC = () => {

    // 2. Define a click handler.
  const sessionHandler = (name: string) => {

    // Obtém o store de cookies
    const cookieStore = cookies();

    // Remove o cookie "session"
    cookieStore.delete('session');
    // Redirecionar o usuário para a página de login ou home
    // router.push('/');

  }

  return (
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
      <AlertDialogAction onClick={() => sessionHandler("session")} className="text-[13px] bg-red-600 hover:bg-red-500">Sim, desejo sair</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
  )
}