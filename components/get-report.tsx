"use client"

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
// import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"
import { getReports } from "@/lib/api";
import { supabase } from "@/lib/supabaseClient";
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";


const FormSchema = z.object({
    reportDate: z.date({
      required_error: "Data do relatório é obrigatória.",
    }),
})

const GetReport: React.FC = () => {

  const [loading, setLoading] = useState(false)
  const [reports, setReports] = useState<any[]>([])

//   useEffect(() => {
//     const getData = async () => {
//         setLoading(true);
//         try {
//             const response = await getReports();
//             const { data } = await response?.json();
//             setData(data);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         } finally {
//             setLoading(false);
//         }
//     };
//     getData();
// }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(values: z.infer<typeof FormSchema>) {

    setLoading(true);

    const formDate = new Intl.DateTimeFormat('pt-BR').format(values.reportDate);
 
    const fetchReportsByDate = async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq("createdAtIntDTF", formDate)
        .order('student_name', { ascending: true });

      if (error) {
        toast('Ops... Algo deu errado', {
          description: 'Não foi possível efectuar a operação.',
          duration: 5000,
          cancel: {
            label: 'Fechar',
            onClick: () => console.log('Cancel!'),
          },
        })
      } else {
        setReports(data);
      }

      setLoading(false);
    };

    fetchReportsByDate()
  }

  return (
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex items-center gap-4 mt-2">
        <FormField
          control={form.control}
          name="reportDate"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Escolha uma data</span>
                      )}
                      {/* <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> */}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Pesquisar</Button>
      </form>
      {loading
      ? <div className="flex justify-center items-center mt-20">
          <i className="ri-loader-line animate-spin text-[14px]"></i>
        </div>
      : reports.length !== 0 
      ?  <Table className="mt-6 rounded-sm">
        {/* JSON.stringify(reports, null) */}
          {/* <TableCaption>A list of your recent alunos.</TableCaption> */}
          <TableHeader className="bg-zinc-200/50 border border-zinc-200">
            <TableRow>
              {/* <TableHead className="w-[100px]">Código</TableHead> */}
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Comportamento</TableHead>
              <TableHead>Data do relatório</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="border border-zinc-200">
            {reports.map((report: any) => (
              <TableRow key={report.id}>
                {/* <TableCell className="font-medium">{report.id}</TableCell> */}
                <TableCell>{report.student_name}</TableCell>
                <TableCell>{report.email}</TableCell>
                <TableCell>{report.behavior}</TableCell>
                <TableCell>{report.createdAtIntDTF}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
      : <div className="flex justify-center items-center mt-20">
          <p className="text-muted-foreground">Dados não encontrados. Tente seleccionar uma data diferente.</p>
        </div>}
    </Form>
  )
}

export default GetReport