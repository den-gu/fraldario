import { CardDescription, CardTitle } from "@/components/ui/card";
import { cookies } from 'next/headers'
import NavBar from "@/components/navbar";
import React from "react";
import { redirect } from 'next/navigation'
import GetStudent from "@/components/get-student";
import { Toaster } from "sonner";

const Home: React.FC = async () => {

  const cookieStore = cookies()
  const sessionValue = cookieStore.get('session')?.value;
  const isLoggedIn = sessionValue !== undefined ? true : false
  const permissionLevel = sessionValue === 'token-fraldario-admin' ? 'admin' : 'user'

  return (
    (isLoggedIn ? 
        <React.Fragment>
        <Toaster 
        toastOptions={{
          classNames: {
            toast: 'bg-white',
            title: 'text-black',
            description: 'text-muted-foreground',
            cancelButton: 'bg-white',
            closeButton: 'bg-white',
          },
          style: {
            border: 'text-zinc-200'
          }
        }}
      />
        <NavBar permLevel = {permissionLevel} />
    <div className="flex flex-col items-center min-h-screen px-4 pt-4 pb-4 bg-white">
      <div className="w-full max-w-[700px]">
        <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-4xl">
          Olá, {permissionLevel}
        </h1>
        <p className="leading-4 text-[14px] [&:not(:first-child)]:mt-6">
          No campo abaixo, digite o nome do aluno que pretende visualizar
        </p>
        <div className="mt-3">
          <GetStudent permLevel={permissionLevel} />
        </div>
    </div>
      {/* <CardTitle className="text-[25px] text-black">Olá, {permissionLevel}</CardTitle> */}
      {/* <CardDescription className="text-muted-foreground mt-2">No campo abaixo, digite o nome do aluno que pretende visualizar.</CardDescription> */}

      </div>
    </React.Fragment>
    : 
      redirect('/')
    ) 
  )
}

export default Home