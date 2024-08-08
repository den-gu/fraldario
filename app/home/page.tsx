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
    <div className="min-h-screen px-4 lg:px-20 pt-8 pb-4 bg-white">
      <CardTitle className="text-[25px] text-black">Olá, {permissionLevel}</CardTitle>
      <CardDescription className="text-muted-foreground mt-2">No campo abaixo, digite o nome do aluno que pretende para visualizar.</CardDescription>

      <GetStudent permLevel={permissionLevel}/>
    </div>
    </React.Fragment>
    : 
      redirect('/')
    ) 
  )
}

export default Home