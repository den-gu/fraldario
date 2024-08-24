"use client"

import React, { useState, useEffect } from "react"

import { useMediaQuery } from "@react-hook/media-query"
import { Button } from "@/components/ui/button"
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { deleteStudent, getMeals, getStudents, saveReport, sendReport } from "@/lib/api"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select"
import { Input } from "./ui/input"
import { CardTitle } from "./ui/card"
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "./ui/form"
import { Textarea } from "./ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { toast } from 'sonner';
import { supabase } from "@/lib/supabaseClient"
import { DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";



type Student = {
  id: string | "";
  name: string | "";
  email: string | "";
  parent: string | "";
}

export default function StudentsList(props: any) {

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)
    const [students, setStudents] = useState<Student[]>([])
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(
    null
  )
  const [downloading, setDownloading] = useState(false)
  const [downloadAll, setDownloadAll] = useState(false)
  const [isSendingEmail, setSending] = useState(false)
  const [reports, setReports] = useState<any[]>([])

  useEffect(() => {
    const getData = async () => {
        // setLoading(true);
        try {
            const response = await getStudents();
            const { data } = await response?.json();
            setStudents(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    getData();
}, []);
 
 
if (isDesktop) {
    return (
      <div>
        <Popover open={open} onOpenChange={setOpen}>
        <div className="flex items-center relative">
          <PopoverTrigger asChild className="flex-1 cursor-text">
            <Button variant="secondary" className="w-full justify-start">
              <div className="flex items-center gap-2 text-[13px]">
                <i className="ri-search-line text-[16px]"></i>
                {selectedStudent ? selectedStudent.name : 'Pesquisar'}
              </div>
            </Button>
          </PopoverTrigger>
          {selectedStudent ? 
          <Button variant="secondary" onClick={() => setSelectedStudent(null)} className="text-[16px] absolute right-0 shadow-none">
          <div className="flex items-center gap-2"><i className="ri-close-circle-line"></i></div>
        </Button> : ''}
        </div>
        <PopoverContent className="w-[200px] p-0" align="start">
          <StudentList setOpen={setOpen} setSelectedStudent={setSelectedStudent} />
        </PopoverContent>
      </Popover>
      <StudentData></StudentData>
      </div>
    )
  }
 
  return (
    <div>
      <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-[13px]">
          {selectedStudent ? <>{selectedStudent.name}</> 
          : <div className="flex items-center gap-2"><i className="ri-search-line"></i>Pesquisar</div>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StudentList setOpen={setOpen} setSelectedStudent={setSelectedStudent} />
        </div>
      </DrawerContent>
    </Drawer>
    <StudentData></StudentData>
    </div>
  )


  function StudentList({
    setOpen,
    setSelectedStudent,
  }: {
    setOpen: (open: boolean) => void
    setSelectedStudent: (student: Student | null) => void
  }) {
    return (
      <Command className="w-full">
        <CommandInput className="w-full" placeholder="Digite o nome..." />
        <CommandList>
          <CommandEmpty>
            <span>Nenhum resultado encontrado.</span>
          </CommandEmpty>
          <CommandGroup>
            {students
            ? students.map((student) => (
              <CommandItem
                key={student.id}
                value={student.name}
                onSelect={(value) => {
                  setSelectedStudent(
                    students.find((priority) => priority.id === student.id) || null
                  )
                  setOpen(false)
                }}
              >
                {student.name}
              </CommandItem>
            ))
            : <div><i className="ri-loader-line animate-spin text-[14px]"></i></div>}
          </CommandGroup>
        </CommandList>
      </Command>
    )
  }

  function StudentData({ className }: React.ComponentProps<"form">) {

    // const [isSubmitting, setSubmitting] = useState(false)
  
    // Declarando múltiplos estados como propriedades de um objecto
    const [state, setState] = useState({
      name: selectedStudent?.name || "",
      email: selectedStudent?.email || "",
      behavior: "",
    })
  
    // Modificando um dos estados
    const updateField = (field: any, value: any) => {
      setState((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    };


    const deleteHandler = async (id: string | undefined, name: string | undefined) => {
      // const response = await deleteStudent(id);
      try {
        await deleteStudent(id)
        toast('Sucesso', {
          description: `${name} foi removido(a).`,
          duration: 5000,
          cancel: {
            label: 'Fechar',
            onClick: () => console.log('Cancel!'),
          },
        })
      } catch (error) {
        console.log(error)
      } finally {
        setTimeout(() => {
          // Recarregar a página inteira
          window.location.reload()
        }, 2000);
      }
    }
  
    return (
        // <div className="flex justify-center items-center mt-20">
        //   <i className="ri-loader-line animate-spin text-[14px]"></i>
        // </div>
        loading ? 
        <div className="flex justify-center items-center mt-20">
          <i className="ri-loader-line animate-spin text-[14px]"></i>
        </div>
        : <div>
          <div className="flex items-center gap-5 mt-4">
            <b className="text-muted-foreground">Total: {students.length}</b>
            {/* <Button variant="link" disabled={downloadAll} className="text-blue-400 text-[13px] h-0 py-0 px-2">
            {downloadAll ? (
              <i className="ri-loader-line animate-spin text-[14px]"></i>
            )
              : (
                <>
                  <i className="ri-download-line mr-1 text-[13px]"></i> Baixar
                </>
              )}
          </Button> */}
          </div>
            <Table className="rounded-sm mt-3">
            {/* <TableCaption>A list of your recent alunos.</TableCaption> */}
            <TableHeader className="bg-zinc-200/50 border border-zinc-200 text-[13px]">
              <TableRow>
                {/* <TableHead className="w-[100px]">Código</TableHead> */}
                <TableHead className="max-w-14"># ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Parente</TableHead>
                <TableHead>Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border border-zinc-200 text-[13px]">
              {selectedStudent ? (
                <TableRow>
                  
                  <TableCell className="font-medium max-w-14 overflow-hidden text-nowrap text-ellipsis">
                    {selectedStudent?.id.slice(0, 5)}
                  </TableCell>
                  {/* <TableCell>{data.id}</TableCell> */}
                  <TableCell>{selectedStudent?.name}</TableCell>
                  <TableCell>{selectedStudent?.email}</TableCell>
                  <TableCell>{selectedStudent?.parent}</TableCell>
                  <TableCell className="text-left p-0 flex items-center gap-1">
                    <Button variant="link" disabled={downloading} className="flex items-center text-blue-400 text-[13px] px-2">
                      {downloading ? (
                        <i className="ri-loader-line animate-spin text-[14px]"></i>
                      )
                        : (
                          <>
                            <i className="ri-edit-line mr-1 text-[13px]"></i>
                            Editar
                          </>
                        )}
                    </Button>
                    <Button variant="link" disabled={isSendingEmail} className="flex items-center text-red-400 text-[13px] px-2">
                      {isSendingEmail ? (
                        <i className="ri-loader-line animate-spin text-[14px]"></i>
                      )
                        : (
                          <>
                            <i className="ri-delete-bin-7-line mr-1 text-[13px]"></i>
                            Remover
                          </>
                        )}
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((data: any) => (
                  <TableRow key={data.id.slice(0, 5)}>
                    <TableCell className="font-medium max-w-14 overflow-hidden text-nowrap text-ellipsis">
                      {data.id.slice(0, 5)}
                    </TableCell>
                    <TableCell>{data.name}</TableCell>
                    <TableCell>{data.email}</TableCell>
                    <TableCell>{data.parent}</TableCell>
                    <TableCell className="text-left p-0 flex items-center gap-1">
                    <Button variant="link" disabled={downloading} className="flex items-center text-blue-400 text-[13px] px-2">
                      {downloading ? (
                        <i className="ri-loader-line animate-spin text-[14px]"></i>
                      )
                        : (
                          <>
                            <i className="ri-edit-line mr-1 text-[13px]"></i>
                            Editar
                          </>
                        )}
                    </Button>
                    <Button variant="link" disabled={isSendingEmail} className="flex items-center text-red-400 text-[13px] px-2">
                      {isSendingEmail ? (
                        <i className="ri-loader-line animate-spin text-[14px]"></i>
                      )
                        : (
                          <>
                            <i className="ri-delete-bin-7-line mr-1 text-[13px]"></i>
                            Remover
                          </>
                        )}
                    </Button>
                  </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
          </Table>
          </div>
        )
  }
}


