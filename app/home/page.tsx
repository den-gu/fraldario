import Grade from "@/components/grade";
import { CardDescription, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog"


import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Report from "@/components/report";
import { Button } from "@/components/ui/button";
import DeleteAction from "@/components/delete-action";
import NavBar from "@/components/navbar";
import React from "react";


export default async function Home() {

  const cookieStore = cookies()
  const supabase = createClient()

  const response = await supabase.from("alunos").select("*")
  const data = response.data;

  return (
    <React.Fragment>
        <NavBar />
    <div className="container min-h-screen px-4 pt-8 pb-20 bg-white">
      <CardTitle className="text-[22px] text-black">Bem-vindo(a)</CardTitle>
      <CardDescription className="text-[13px] text-muted-foreground">Preencha os campos abaixo para visualizar a turma ou aluno que deseja.</CardDescription>
      <Grade />

      <Table className="mt-5 rounded-sm text-[13px]">
      {/* <TableCaption>A list of your recent alunos.</TableCaption> */}
      <TableHeader className="bg-zinc-200/50 border border-zinc-200">
        <TableRow>
          <TableHead className="w-[140px] font-bold">Código</TableHead>
          <TableHead className="font-bold">Nome</TableHead>
          <TableHead className="font-bold">Ano</TableHead>
          <TableHead className="font-bold">Turma</TableHead>
          <TableHead className="font-bold">Parente</TableHead>
          <TableHead className="font-bold">E-mail</TableHead>
          <TableHead className="w-[60px] font-bold">Ação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="border border-zinc-200">
      {
          data?.map((aluno) => (
            <TableRow key={aluno.id}>
                  <TableCell className="max-w-[140px] font-medium text-nowrap overflow-hidden text-ellipsis">{aluno.id}</TableCell>
                  <TableCell>
                    <Dialog>
              <DialogTrigger className="hover:cursor-pointer hover:text-blue-500 hover:underline">
              {aluno.name}
              </DialogTrigger>

              <Report
              id={aluno.id}
              name={aluno.name}
              year={aluno.year}
              class={aluno.class}
              email={aluno.email} />

              </Dialog>
                  </TableCell>
                  <TableCell>{aluno.year}</TableCell>
                  <TableCell>{aluno.class}</TableCell>
                  <TableCell>{aluno.parent}</TableCell>
                  <TableCell>{aluno.email}</TableCell>
                  <TableCell className="flex items-center gap-6 pr-4">
                    <Button type="button" className="text-[12px] p-0 h-auto border-0 shadow-none bg-transparent hover:bg-transparent hover:underline" variant="outline">
                      {/* <i className="ri-pencil-line text-[18px]"></i> */}
                      Editar
                    </Button>
                    {/* <Button type="button"
                      onClick={(e) => deleteStudent(props.alunoID)}
                    className="bg-red-600 hover:bg-red-500">Sim, desejo apagar
                  </Button> */}
                    <DeleteAction alunoID={aluno.id} />
                  </TableCell>
                </TableRow>
          ))
      }
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
    </div>
    </React.Fragment> 
  )
}
