import { cookies } from 'next/headers'
import NavBar from "@/components/navbar";
import React from "react";
import { redirect } from 'next/navigation'
import { Toaster } from "sonner";
import GetReport from '@/components/get-report';
import StudentsList from '@/components/students-list';

const Students: React.FC = async () => {

  const cookieStore = cookies()
  const sessionValue = cookieStore.get('session')?.value;
  const isLoggedIn = sessionValue !== undefined ? true : false
  const permissionLevel = sessionValue === 'token-fraldario-admin' ? 'admin' : 'user'

  return (
    (isLoggedIn ? 
        <React.Fragment>
        <NavBar permLevel = {permissionLevel} />
    <div className="flex flex-col items-center min-h-screen px-4 pt-4 pb-4 bg-white">
      <div className="w-full max-w-[700px] pt-6">
        <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-4xl">
          Alunos
        </h1>
        <p className="leading-4 text-[14px] [&:not(:first-child)]:mt-6">
          Pesquise, edite ou remova as informações dos alunos
        </p>
        <div className="mt-3">
            <StudentsList />
        </div>
    </div>
      </div>
    </React.Fragment>
    : 
      redirect('/')
    ) 
  )
}

export default Students