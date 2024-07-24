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


const alunosa = [
  {
    id: "001",
    paymentStatus: "Paid",
    email: "aluno1@gmail.com",
    paymentMethod: "Credit Card",
  },
  {
    id: "002",
    paymentStatus: "Pending",
    email: "aluno2@gmail.com",
    paymentMethod: "PayPal",
  },
  {
    id: "003",
    paymentStatus: "Unpaid",
    email: "aluno3@gmail.com",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "004",
    paymentStatus: "Paid",
    email: "aluno4@gmail.com",
    paymentMethod: "Credit Card",
  },
  {
    id: "005",
    paymentStatus: "Paid",
    email: "aluno5@gmail.com",
    paymentMethod: "PayPal",
  },
  {
    id: "006",
    paymentStatus: "Pending",
    email: "aluno6@gmail.com",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "007",
    paymentStatus: "Unpaid",
    email: "aluno7@gmail.com",
    paymentMethod: "Credit Card",
  },
]

export default async function Home() {

  const cookieStore = cookies()
  const supabase = createClient()

  const response = await supabase.from("alunos").select("*")
  const data = response.data;

  // console.log(data);
  // return <pre>{JSON.stringify(data, null, 2)}</pre>

  return (  
    <div className="container h-screen px-4 pt-10 pb-20 bg-white">
      <CardTitle className="text-2xl text-black">Bem-vindo(a)</CardTitle>
      <CardDescription className="text-sm text-muted-foreground">Preencha os campos abaixo para visualizar a turma ou aluno que deseja.</CardDescription>
      <Grade />

      <Table className="mt-6 rounded-sm">
      {/* <TableCaption>A list of your recent alunos.</TableCaption> */}
      <TableHeader className="bg-zinc-200/50 border border-zinc-200">
        <TableRow>
          <TableHead className="w-[140px]">Código</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Ano</TableHead>
          <TableHead>Turma</TableHead>
          <TableHead>Parente</TableHead>
          <TableHead>E-mail</TableHead>
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
  );
}
