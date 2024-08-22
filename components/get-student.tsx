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



type Student = {
  id: string | undefined;
  name: string | undefined;
  email: string | undefined;
}

type Meal = {
  pequeno_almoco: string | undefined;
  almoco1: string | undefined;
  almoco2: string | undefined;
  sobremesa: string | undefined; 
  lanche: string | undefined;
  extras1: string | undefined,
  extras2: string | undefined,
}

interface IReport {
  id: string;
  name: string;
  year: number;
  class: string;
  email: string;
}

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  behavior: z.string().min(3, { message: "* Obrigatório" }),
  pequenoAlmoco: z.string().optional(),
  almoco1: z.string().optional(),
  almoco2: z.string().optional(),
  sobremesa: z.string().optional(),
  lanche: z.string().optional(),
  extras1: z.string().optional(),
  extras2: z.string().optional(),
  porcaoPequenoAlmoco: z.string().min(1, { message: "* Obrigatório" }),
  porcaoAlmoco1: z.string().min(1, { message: "* Obrigatório" }),
  porcaoAlmoco2: z.string().min(1, { message: "* Obrigatório" }),
  porcaoSobremesa: z.string().min(1, { message: "* Obrigatório" }),
  porcaoLanche: z.string().min(1, { message: "* Obrigatório" }),
  porcaoExtras1: z.string().optional(),
  porcaoExtras2: z.string().optional(),
  fezes: z.string().min(1, { message: "* Obrigatório" }),
  fezesNr: z.string().optional(),
  vomitos: z.string().min(1, { message: "* Obrigatório" }),
  vomitosNr: z.string().optional(),
  febres: z.string().min(1, { message: "* Obrigatório" }),
  description: z.string().max(300).optional(),
})


export default function GetStudent(props: any) {

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [saving, setSaving] = useState(false)
    const [students, setStudents] = useState<Student[]>([])
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(
    null
  )
  const [lastMeal, setLastMeal] = useState<Meal | null>(null);


  useEffect(() => {
    const getData = async () => {
        setLoading(true);
        try {
            const response = await getStudents();
            const { data } = await response?.json();
            setStudents(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLastMeal = async () => {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Erro ao buscar última refeição:', error);
      } else {
        setLastMeal(data);
      }
    };

    fetchLastMeal();
    getData();
}, []);
 
  if (isDesktop) {
    return (
      <div>
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="secondary" className="w-full justify-start text-[13px]">
          {selectedStudent ? 
          <div className="flex items-center gap-2"><i className="ri-search-line"></i>{selectedStudent.name}</div>
          : <div className="flex items-center gap-2"><i className="ri-search-line"></i>Pesquisar</div>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <StudentList setOpen={setOpen} setSelectedStudent={setSelectedStudent} />
        </PopoverContent>
      </Popover>
      {selectedStudent ? 
        <StudentData></StudentData>
    :   ''
    }
      </div>
    )
  }
 
  return (
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
            <i className="ri-loader-line animate-spin text-[14px]"></i>
            {/* <span>No results found.</span> */}
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
            : <i className="ri-loader-line animate-spin text-[14px]"></i>}
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
      pequenoAlmoco: lastMeal?.pequeno_almoco || "",
      almoco1: lastMeal?.almoco1 || "",
      almoco2: lastMeal?.almoco2 || "",
      sobremesa: lastMeal?.sobremesa || "",
      lanche: lastMeal?.lanche || "",
      extras1: lastMeal?.extras1 || "",
      extras2: lastMeal?.extras2 || "",
      porcaoPequenoAlmoco: "",
      porcaoAlmoco1: "",
      porcaoAlmoco2: "",
      porcaoSobremesa: "",
      porcaoLanche: "",
      porcaoExtras1: "",
      porcaoExtras2: "",
      fezes: "",
      fezesNr: "",
      vomitos: "",
      vomitosNr: "",
      febres: "",
      description: ""
    })
  
    const loadHandler = (state: boolean) => {
      setIsLoading(!state)
    }
  
    const sendingHandler = (state: boolean) => {
      setSaving(!state)
      setTimeout(() => {
        toast('Sucesso', {
          description: 'A informação foi guardada.',
          duration: 15000,
          cancel: {
            label: 'Fechar',
            onClick: () => console.log('Cancel!'),
          },
        })
        setSaving(state)
      }, 2000);
    }
  
    // Modificando um dos estados
    const updateField = (field: any, value: any) => {
      setState((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    };
  
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        id: selectedStudent?.id || "",
        name: selectedStudent?.name || "",
        email: selectedStudent?.email || "",
        behavior: state.behavior,
        pequenoAlmoco: lastMeal?.pequeno_almoco || "",
        almoco1: lastMeal?.almoco1 || "",
        almoco2: lastMeal?.almoco2 || "",
        sobremesa: lastMeal?.sobremesa || "",
        lanche: lastMeal?.lanche || "",
        extras1: lastMeal?.extras1 || "",
        extras2: lastMeal?.extras2 || "",
        porcaoPequenoAlmoco: "",
        porcaoAlmoco1: "",
        porcaoAlmoco2: "",
        porcaoSobremesa: "",
        porcaoLanche: "",
        porcaoExtras1: "",
        porcaoExtras2: "",
        fezes: "",
        vomitos: "",
        febres: "",
        description: ""
      },
    })
  
    const downloadPDF = () => {
  
      loadHandler(isLoading);
  
      const doc = new jsPDF('l');
      const date = new Date();
      const createdAt = new Intl.DateTimeFormat('pt-BR').format(date);
  
      doc.setFontSize(10);
      doc.text('O Fraldario', 14, 25);
      doc.text(`Data: ${createdAt}`, 190, 25, { align: 'right' });
      doc.text(`Nome da criança: ${state.name}`, 14, 30);
      doc.text(`Comportamento: ${state.behavior}`, 190, 30, { align: 'right' });
  
      doc.text(`Refeição/Porção`, 14, 40);
  
      // Generate the table
      autoTable(doc, {
        head: [["Pequeno-almoço", "Almoço: 1º", "Almoço: 2º", "Sobremesa", "Lanche", "Extras: 1º", "Extras: 2º"]],
        theme: 'striped',
        styles: {
          fontSize: 10
        },
        margin: { top: 43 },
        body: [
          [`${lastMeal?.pequeno_almoco}`, `${lastMeal?.almoco1}`, `${lastMeal?.almoco2}`, `${lastMeal?.sobremesa}`, `${lastMeal?.lanche}`, `${lastMeal?.extras1}`, `${lastMeal?.extras2}`],
          [`${state.porcaoPequenoAlmoco}`, `${state.porcaoAlmoco1}`, `${state.porcaoAlmoco2}`, `${state.porcaoSobremesa}`, `${state.porcaoLanche}`, `${state.porcaoExtras1}`, `${state.porcaoExtras2}`],
        ],
      })
  
      doc.text(`Fezes: ${state.fezes}             Vômitos: ${state.vomitos}             Febres: ${state.febres}`, 14, 75);
      doc.text(`Outras ocorrências: ${state.description}`, 14, 85);
  
      setTimeout(async () => {
        loadHandler(!isLoading);
        // Save the PDF
        doc.save(`Relatorio-${createdAt}-${state.name}.pdf`);
        toast('Sucesso', {
          description: 'O ficheiro foi descarregado.',
          duration: 5000,
          cancel: {
            label: 'Fechar',
            onClick: () => console.log('Closed!'),
          },
        })
      }, 2000);
    }
  
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
  
      try {
        sendingHandler(saving);
        // await sendReport(values);
        await saveReport(values);
      } catch (error) {
        console.log(error)
      }
    }


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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="h-auto pb-4">
          <div className="grid gap-7 grid-cols-4 mt-5">
            <div className="col-span-4">
            <div className="flex flex-col w-full gap-3">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      {/* <CardTitle className="text-left text-[13px]">Nome da criança</CardTitle> */}
                      <FormLabel className="text-[12px]">Nome da criança</FormLabel>
                      <FormControl>
                        <Input defaultValue={selectedStudent?.name} placeholder={selectedStudent?.name} disabled {...field}
                          className="disabled:placeholder:text-[#000000] text-[13px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                {/* <FormField
                  control={form.control}
                  name="behavior"
                  render={({ field }) => (
                    <FormItem className="min-w-[140px]">
                      <FormLabel className="text-[12px]">Comportamento</FormLabel>
                      <Select
                         defaultValue={field.value}
                        onValueChange={(e) => {
                          field.onChange(e);  // Chama o onChange original do field
                          updateField('behavior', e);  // Chama a função que actualiza o estado
                        }} required>
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder="" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem className="text-[13px]" value="Bom">Bom</SelectItem>
                          <SelectItem className="text-[13px]" value="Mau">Mau</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} /> */}
                  <FormField
                  control={form.control}
                  name="behavior"
                  render={({ field }) => (
                    <FormItem className="min-w-[140px]">
                      <FormLabel className="text-[12px]">Comportamento</FormLabel>
                      <Select
                        value={field.value}  // Use value instead of defaultValue
                        onValueChange={(e) => {
                          field.onChange(e);
                          updateField('behavior', e);
                        }} required>
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder="" className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem className="text-[13px]" value="Bom">Bom</SelectItem>
                          <SelectItem className="text-[13px]" value="Mau">Mau</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
  
              {/* <CardTitle className="text-left text-[13px]">Refeições</CardTitle> */}
              {/* <CardTitle className="text-left text-[13px]">Refeição/Porção</CardTitle> */}
              <div className="flex justify-between gap-4">
                <FormField
                  control={form.control}
                  name="pequenoAlmoco"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-[12px]">Pequeno-almoço</FormLabel>
                      <FormControl>
                        <Input placeholder="Pequeno-almoço" className="text-[13px]" disabled {...field}
                          defaultValue={state.pequenoAlmoco}
                          // value={state.pequenoAlmoco}
                          onChange={(e) => {
                            field.onChange(e);  // Chama o onChange original do field
                            updateField('pequenoAlmoco', e.target.value);  // Chama a função que actualiza o estado
                          }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                <FormField
                  control={form.control}
                  name="porcaoPequenoAlmoco"
                  render={({ field }) => (
                    <FormItem className="min-w-[140px]">
                      <FormLabel className="text-[12px]">Porção</FormLabel>
                      <Select
                        defaultValue={state.porcaoPequenoAlmoco}
                        onValueChange={(e) => {
                          field.onChange(e);  // Chama o onChange original do field
                          updateField('porcaoPequenoAlmoco', e);  // Chama a função que actualiza o estado
                        }} >
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder="..." className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem className="text-[13px]" value="2 Porções">2 Porções</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção">1 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/2 Porção">1/2 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/4 Porção">1/4 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
              </div>

              <div className="flex justify-between gap-4">
                <FormField
                  control={form.control}
                  name="extras1"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-[12px]">Extra da Manhã</FormLabel>
                      <FormControl>
                        <Input placeholder={state.extras1} className="text-[13px]" disabled {...field}
                          defaultValue={state.extras1}
                          // value={state.lanche}
                          onChange={(e) => {
                            field.onChange(e);  // Chama o onChange original do field
                            updateField('extras1', e.target.value);  // Chama a função que actualiza o estado
                          }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField
                  control={form.control}
                  name="porcaoExtras1"
                  render={({ field }) => (
                    <FormItem className="min-w-[140px]">
                      <FormLabel className="text-[12px]">Porção</FormLabel>
                      <Select
                        defaultValue={state.porcaoExtras1}
                        onValueChange={(e) => {
                          field.onChange(e);  // Chama o onChange original do field
                          updateField('porcaoExtras1', e);  // Chama a função que actualiza o estado
                        }} >
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder="..." className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem className="text-[13px]" value="2 Porções">2 Porções</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção">1 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/2 Porção">1/2 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/4 Porção">1/4 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
              </div>
  
              <div className="flex justify-between gap-4">
                <FormField
                  control={form.control}
                  name="almoco1"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-[12px]">1º Almoço</FormLabel>
                      <FormControl>
                        <Input placeholder="Almoço: 1º" className="text-[13px]" disabled {...field}
                          defaultValue={state.almoco1}
                          // value={state.almoco1}
                          onChange={(e) => {
                            field.onChange(e);  // Chama o onChange original do field
                            updateField('almoco1', e.target.value);  // Chama a função que actualiza o estado
                          }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                <FormField
                  control={form.control}
                  name="porcaoAlmoco1"
                  render={({ field }) => (
                    <FormItem className="min-w-[140px]">
                      <FormLabel className="text-[12px]">Porção</FormLabel>
                      <Select
                        defaultValue={state.porcaoAlmoco1}
                        onValueChange={(e) => {
                          field.onChange(e);  // Chama o onChange original do field
                          updateField('porcaoAlmoco1', e);  // Chama a função que actualiza o estado
                        }} >
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder="..." className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem className="text-[13px]" value="2 Porções">2 Porções</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção">1 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/2 Porção">1/2 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/4 Porção">1/4 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
              </div>
  
  
              <div className="flex justify-between gap-4">
                <FormField
                  control={form.control}
                  name="almoco2"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-[12px]">2º Almoço</FormLabel>
                      <FormControl>
                        <Input placeholder="Almoço: 2º" className="text-[13px]" disabled {...field}
                          defaultValue={state.almoco2}
                          // value={state.almoco2}
                          onChange={(e) => {
                            field.onChange(e);  // Chama o onChange original do field
                            updateField('almoco2', e.target.value);  // Chama a função que actualiza o estado
                          }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                <FormField
                  control={form.control}
                  name="porcaoAlmoco2"
                  render={({ field }) => (
                    <FormItem className="min-w-[140px]">
                      <FormLabel className="text-[12px]">Porção</FormLabel>
                      <Select
                        defaultValue={state.porcaoAlmoco2}
                        onValueChange={(e) => {
                          field.onChange(e);  // Chama o onChange original do field
                          updateField('porcaoAlmoco2', e);  // Chama a função que actualiza o estado
                        }} >
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder="..." className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem className="text-[13px]" value="2 Porções">2 Porções</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção">1 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/2 Porção">1/2 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/4 Porção">1/4 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
              </div>

              <div className="flex justify-between gap-4">
                <FormField
                  control={form.control}
                  name="extras2"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-[12px]">Extra da Tarde</FormLabel>
                      <FormControl>
                        <Input placeholder={state.extras2} className="text-[13px]" disabled {...field}
                          defaultValue={state.extras2}
                          // value={state.lanche}
                          onChange={(e) => {
                            field.onChange(e);  // Chama o onChange original do field
                            updateField('extras2', e.target.value);  // Chama a função que actualiza o estado
                          }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField
                  control={form.control}
                  name="porcaoExtras2"
                  render={({ field }) => (
                    <FormItem className="min-w-[140px]">
                      <FormLabel className="text-[12px]">Porção</FormLabel>
                      <Select
                        // defaultValue={state.porcaoExtras2}
                        onValueChange={(e) => {
                          field.onChange(e);  // Chama o onChange original do field
                          updateField('porcaoExtras2', e);  // Chama a função que actualiza o estado
                        }} >
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder="..." className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem className="text-[13px]" value="2 Porções">2 Porções</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção">1 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/2 Porção">1/2 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/4 Porção">1/4 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
              </div>
  
  
              <div className="flex justify-between gap-4">
                <FormField
                  control={form.control}
                  name="sobremesa"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-[12px]">Sobremesa</FormLabel>
                      <FormControl>
                        <Input placeholder="Sobremesa" className="text-[13px]" disabled {...field}
                          defaultValue={state.sobremesa}
                          // value={state.sobremesa}
                          onChange={(e) => {
                            field.onChange(e);  // Chama o onChange original do field
                            updateField('sobremesa', e.target.value);  // Chama a função que actualiza o estado
                          }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                <FormField
                  control={form.control}
                  name="porcaoSobremesa"
                  render={({ field }) => (
                    <FormItem className="min-w-[140px]">
                      <FormLabel className="text-[12px]">Porção</FormLabel>
                      <Select
                        defaultValue={state.porcaoSobremesa}
                        onValueChange={(e) => {
                          field.onChange(e);  // Chama o onChange original do field
                          updateField('porcaoSobremesa', e);  // Chama a função que actualiza o estado
                        }} >
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder="..." className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem className="text-[13px]" value="2 Porções">2 Porções</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção">1 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/2 Porção">1/2 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/4 Porção">1/4 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
              </div>
  
              <div className="flex justify-between gap-4">
                <FormField
                  control={form.control}
                  name="lanche"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-[12px]">Lanche</FormLabel>
                      <FormControl>
                        <Input placeholder="Lanche" className="text-[13px]" disabled {...field}
                          defaultValue={state.lanche}
                          // value={state.lanche}
                          onChange={(e) => {
                            field.onChange(e);  // Chama o onChange original do field
                            updateField('lanche', e.target.value);  // Chama a função que actualiza o estado
                          }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                <FormField
                  control={form.control}
                  name="porcaoLanche"
                  render={({ field }) => (
                    <FormItem className="min-w-[140px]">
                      <FormLabel className="text-[12px]">Porção</FormLabel>
                      <Select
                        defaultValue={state.porcaoLanche}
                        onValueChange={(e) => {
                          field.onChange(e);  // Chama o onChange original do field
                          updateField('porcaoLanche', e);  // Chama a função que actualiza o estado
                        }} >
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder="..." className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem className="text-[13px]" value="2 Porções">2 Porções</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção">1 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/2 Porção">1/2 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/4 Porção">1/4 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
              </div>
  
            </div>
            </div>
          </div>

          <div className="flex gap-4 mt-5">
              <div className="w-full border-zinc-200">
                <FormField
                  control={form.control}
                  name="fezes"
                  render={({ field }) => (
                    <FormItem className="min-w-[140px]">
                      {/* <CardTitle className="text-left text-[13px]">Fezes</CardTitle> */}
                      <FormLabel className="text-[12px]">Fezes</FormLabel>
                      <Select
                        defaultValue={state.fezes}
                        onValueChange={(e) => {
                          field.onChange(e);  // Chama o onChange original do field
                          updateField('fezes', e);  // Chama a função que actualiza o estado
                        }} required>
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder="..." className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem className="text-[13px]" value="Normal">Normal</SelectItem>
                          <SelectItem className="text-[13px]" value="Diarreia">Diarreia</SelectItem>
                          <SelectItem className="text-[13px]" value="Não evacuou">Não evacuou</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
              </div>
              
              <div className="w-full border-zinc-200">
                <FormField
                  control={form.control}
                  name="vomitos"
                  render={({ field }) => (
                    <FormItem className="min-w-[140px]">
                      {/* <CardTitle className="text-left text-[13px]">Vômitos</CardTitle> */}
                      <FormLabel className="text-[12px]">Vômitos</FormLabel>
                      <Select
                        defaultValue={state.vomitos}
                        onValueChange={(e) => {
                          field.onChange(e);  // Chama o onChange original do field
                          updateField('vomitos', e);  // Chama a função que actualiza o estado
                        }} required>
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder="..." className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem className="text-[13px]" value="Sim">Sim</SelectItem>
                          <SelectItem className="text-[13px]" value="Não">Não</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
              </div>
              <div className="w-full border-zinc-200">
                <FormField
                  control={form.control}
                  name="febres"
                  render={({ field }) => (
                    <FormItem className="min-w-[140px]">
                      <FormLabel className="text-[12px]">Febres</FormLabel>
                      <Select
                        defaultValue={state.febres}
                        onValueChange={(e) => {
                          field.onChange(e);  // Chama o onChange original do field
                          updateField('febres', e);  // Chama a função que actualiza o estado
                        }} required>
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder="..." className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem className="text-[13px]" value="Sim">Sim</SelectItem>
                          <SelectItem className="text-[13px]" value="Não">Não</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
              </div>
          </div>

          {state.fezes === "Diarreia" || state.vomitos === "Sim" ?
            <div className="flex gap-4 mt-3">
              <div className="w-full border-zinc-200">
              {state.fezes === "Diarreia" ?
              <FormField
                  control={form.control}
                  name="fezesNr"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-[12px]">Quantas vezes?</FormLabel>
                      <FormControl>
                        <Input placeholder="..." type="number" className="text-[13px]" {...field}
                          defaultValue={state.fezesNr}
                          // value={state.sobremesa}
                          onChange={(e) => {
                            field.onChange(e);  // Chama o onChange original do field
                            updateField('fezesNr', e.target.value);  // Chama a função que actualiza o estado
                          }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  : ''}
              </div>
              <div className="w-full border-zinc-200">
              {state.vomitos === "Sim" ?
              <FormField
                  control={form.control}
                  name="vomitosNr"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-[12px]">Quantas vezes?</FormLabel>
                      <FormControl>
                        <Input placeholder="..." type="number" className="text-[13px]" {...field}
                          defaultValue={state.vomitosNr}
                          onChange={(e) => {
                            field.onChange(e);  // Chama o onChange original do field
                            updateField('vomitosNr', e.target.value);  // Chama a função que actualiza o estado
                          }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  : ''}
              </div>
              <div className="w-full border-zinc-200"></div>
            </div> : ''
          }

          <div className="grid grid-cols-4 mt-3">
            <div className="col-span-4">
            {/* <CardTitle className="text-left text-[13px] mt-3 md:mt-1">Outras ocorrências</CardTitle> */}
              <div className="flex justify-between gap-4 mt-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-[12px]">Outras ocorrências</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Deixe a sua mensagem"
                          className="resize-none text-[13px]"
                          {...field}
                          defaultValue={state.description}
                          // value={state.description}
                          onChange={(e) => {
                            field.onChange(e);  // Chama o onChange original do field
                            updateField('description', e.target.value);  // Chama a função que actualiza o estado
                          }}
                        />
                      </FormControl>
                      {/* <FormDescription>
                    You can <span>@mention</span> other users and organizations.
                  </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )} />
              </div>
            </div>
          </div>
  
          <div className="flex justify-between mt-5">
            <div className="flex items-center gap-4">
            {/* <Button type="button" onClick={downloadPDF} disabled={isLoading} variant="secondary" className="w-full md:w-fit flex items-center text-[13px]">
              {isLoading ? (
                <i className="ri-loader-line animate-spin text-[14px]"></i>
              )
                : (
                  <>
                    <i className="ri-download-line mr-2 text-[14px]"></i>
                    Baixar
                  </>
                )}
            </Button> */}
            <Button type="submit" disabled={saving} className="w-full md:w-fit flex items-center text-[13px]">
              {saving ? (
                <i className="ri-loader-line animate-spin text-[14px]"></i>
              )
                : (
                  <>
                    {/* <i className="ri-mail-send-line mr-2 text-[14px]"></i> */}
                    Guardar
                  </>
                )}
            </Button>
            </div>
            {props.permLevel === "admin" ? (
              <AlertDialog>
              <AlertDialogTrigger>
                <Button type="button" disabled={deleting} variant="link" className="flex items-center gap-1 text-[12px] p-0 h-auto border-0 shadow-none bg-transparent hover:bg-transparent text-red-500 hover:no-underline">
                  <i className="ri-delete-bin-line  text-[18px] text-red-500"></i>
                  Remover aluno
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-[16px]">Tem certeza desta ação?</AlertDialogTitle>
                  <AlertDialogDescription className="text-[13px]">
                    Esta ação é irreversível. Os dados do aluno serão apagados permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                  <AlertDialogCancel className="text-[13px]">Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteHandler(selectedStudent?.id, selectedStudent?.name)} disabled={deleting} className="text-[13px] bg-red-600 hover:bg-red-500">Sim, desejo apagar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            ) 
          : <div></div>
          }
          </div>
        </form>
      </Form>
    )
  }
}


