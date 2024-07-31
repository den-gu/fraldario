import { CardDescription, CardTitle } from "@/components/ui/card";
import { cookies } from 'next/headers'
import NavBar from "@/components/navbar";
import React from "react";
import { redirect } from 'next/navigation'
import GetStudents from "@/components/get-users";

const Home: React.FC = async () => {

  const cookieStore = cookies()
  const sessionValue = cookieStore.get('session')?.value;
  const isLoggedIn = sessionValue !== undefined ? true : false
  const permissionLevel = sessionValue === 'token-fraldario-admin' ? 'admin' : 'user'

  return (
    (isLoggedIn ? 
        <React.Fragment>
        <NavBar permLevel = {permissionLevel} />
    <div className="container min-h-screen px-4 pt-8 pb-20 bg-white">
      <CardTitle className="text-[22px] text-black">Olá, {permissionLevel}</CardTitle>
      <CardDescription className="text-[13px] text-muted-foreground">Preencha os campos abaixo para visualizar a turma ou aluno que deseja.</CardDescription>

      <GetStudents permLevel={permissionLevel}/>
    </div>
    </React.Fragment>
    : 
      redirect('/')
    ) 
  )
}

export default Home