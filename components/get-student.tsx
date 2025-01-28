"use client"

import React, { useState, useEffect } from "react"

import { useMediaQuery } from "@react-hook/media-query"
import { Button } from "@/components/ui/button"
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
import { getStudents, saveReport, sendReport } from "@/lib/api"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select"
import { Input } from "./ui/input"
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "./ui/form"
import { Textarea } from "./ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from 'sonner';
import { supabase } from "@/lib/supabaseClient"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"



type Student = {
  id: string | undefined;
  name: string | undefined;
  email: string | undefined;
}

type Meal = {
  pequeno_almoco: string | undefined;
  pequeno_almoco_extra1: string | undefined;
  pequeno_almoco_extra2: string | undefined;
  almoco1: string | undefined;
  almoco1_extra1: string | undefined;
  almoco1_extra2: string | undefined;
  almoco2: string | undefined;
  almoco2_extra1: string | undefined;
  almoco2_extra2: string | undefined;
  sobremesa: string | undefined;
  sobremesa_extra1: string | undefined;
  sobremesa_extra2: string | undefined;
  lanche: string | undefined;
  lanche_extra1: string | undefined;
  lanche_extra2: string | undefined;
  extras1: string | undefined,
  extras2: string | undefined,
}

type Report = {
  behavior: string | undefined;
  pequeno_almoco: string | undefined;
  almoco1: string | undefined;
  almoco2: string | undefined;
  sobremesa: string | undefined;
  lanche: string | undefined;
  extras1: string | undefined,
  extras2: string | undefined,
}

const formSchema = z.object({
  student_name: z.string().optional(),
  email: z.string().email().optional(),
  behavior: z.string().min(3, { message: "* Obrigatório" }),
  pequeno_almoco: z.string().optional(),
  almoco1: z.string().optional(),
  almoco2: z.string().optional(),
  sobremesa: z.string().optional(),
  lanche: z.string().optional(),
  extras1: z.string().optional(),
  extras2: z.string().optional(),
  porcao_pequeno_almoco: z.string().min(1, { message: "* Obrigatório" }),
  porcao_almoco1: z.string().min(1, { message: "* Obrigatório" }),
  porcao_almoco2: z.string().min(1, { message: "* Obrigatório" }),
  porcao_sobremesa: z.string().min(1, { message: "* Obrigatório" }),
  porcao_lanche: z.string().min(1, { message: "* Obrigatório" }),
  porcao_extras1: z.string().optional(),
  porcao_extras2: z.string().optional(),
  fezes: z.string().min(1, { message: "* Obrigatório" }),
  nr_fezes: z.string().optional(),
  vomitos: z.string().min(1, { message: "* Obrigatório" }),
  nr_vomitos: z.string().optional(),
  febres: z.string().min(1, { message: "* Obrigatório" }),
  nr_febres: z.number().or(z.string()).pipe(z.coerce.number()).optional(),
  message: z.string().max(300).optional(),
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
  const [lastReport, setLastReport] = useState<Report | null>(null);


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

    const fetchLastReport = async () => {
      
      const today = new Date();
      
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('created_at', today)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Erro ao buscar último relatório:', error);
        alert(today + data);
      } else {
        if(data) {
          setLastReport(data);

        alert(today + data);

        alert(data);
        } 
      }
    };

    fetchLastMeal();
    fetchLastReport();
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
        <div className="flex items-center relative">
          <DrawerTrigger asChild className="cursor-text">
            <Button variant="outline" className="w-full justify-start">
              <div className="flex items-center gap-2 text-[13px]">
                <i className="ri-search-line text-[16px]"></i>
                {selectedStudent ? selectedStudent.name : 'Pesquisar'}
              </div>
            </Button>
          </DrawerTrigger>
          {selectedStudent ?
            <Button variant="outline" onClick={() => setSelectedStudent(null)} className="text-[16px] absolute right-0 shadow-none border-l-0 rounded-tl-none rounded-bl-none">
              <div className="flex items-center gap-2"><i className="ri-close-circle-line"></i></div>
            </Button> : ''}
        </div>
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
      student_name: selectedStudent?.name || "",
      email: selectedStudent?.email || "",
      pequeno_almoco: "",
      almoco1: "",
      almoco2: "",
      sobremesa: "",
      lanche: "",
      extras1: lastMeal?.extras1 || "",
      extras2: lastMeal?.extras2 || "",
      porcao_pequeno_almoco: "",
      porcao_almoco1: "",
      porcao_almoco2: "",
      porcao_sobremesa: "",
      porcao_lanche: "",
      porcao_extras1: "",
      porcao_extras2: "",
      fezes: "",
      vomitos: "",
      febres: "",
    })

    const loadHandler = (state: boolean) => {
      setIsLoading(!state)
    }

    const sendingHandler = (state: boolean, email: string | undefined) => {
      setSaving(!state)
      setTimeout(() => {
        toast('Sucesso', {
          description: `Informação guardada e enviada para o email: ${email}`,
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
        student_name: selectedStudent?.name || "",
        email: selectedStudent?.email || "",
        pequeno_almoco: "",
        almoco1: state.almoco1 || "",
        almoco2: state.almoco2 || "",
        sobremesa: "",
        lanche: "",
        extras1: lastMeal?.extras1,
        extras2: lastMeal?.extras2,
        porcao_pequeno_almoco: "",
        porcao_almoco1: "",
        porcao_almoco2: "",
        porcao_sobremesa: "",
        porcao_lanche: "",
        porcao_extras1: "",
        porcao_extras2: "",
      },
    })


    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {

      try {
        sendingHandler(saving, selectedStudent?.email);
        await sendReport(values);
        await saveReport(values);
      } catch (error) {
        console.log(error)
      }
    }

    const handleReset = (state1: any, state2: any) => {
      //setState('behavior', '');
      //setState('pequeno_almoco', '');
      //setState('almoco1', '');
      //updateField('almoco2', '');
      //updateField('sobremesa', '');
      //updateField('lanche', '');
      //updateField('extras1', lastMeal?.extras1 || "");
      //updateField('extras2', lastMeal?.extras2 || "");
      //updateField('porcao_pequeno_almoco', "");
      //updateField('porcao_almoco1', "");
      //updateField('porcao_almoco2', "");
      //updateField('porcao_sobremesa', "");
      //updateField('porcao_lanche', "");
      //updateField('porcao_extras1', "");
      //updateField('porcao_extras2', "");
      //updateField('fezes', "");
      //updateField('vomitos', "");
      //updateField('febres', "");
      //updateField('behavior', '');
      const value = "";

    //updateField = (, value: any) => {
      //setState((prevState) => ({
      //  ...prevState,
   //     [state1]: value,
     // }));
    //  setState((prevState) => ({
 //       ...prevState,
   //     [state2]: value,
     // }));
     // setState(() => ({
       // [state1]: value,
     // }));

      alert(state + state2)
    //};
   } 


    return (
      selectedStudent ? (
        <Card className="mt-5">
          <CardContent className="space-y-2">
          <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="h-auto pb-4">
          <div className="grid gap-7 grid-cols-4 mt-5">
            <div className="col-span-4">
            <div className="flex flex-col w-full gap-3">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="student_name"
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
              <div className="flex justify-between gap-4">
                <FormField
                  control={form.control}
                  name="pequeno_almoco"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-[12px]">Pequeno-almoço</FormLabel>
                      <Select
                        value={field.value}  // Use value instead of defaultValue
                        onValueChange={(e) => {
                          field.onChange(e);
                          updateField('pequeno_almoco', e);
                        }} required>
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder="..." className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem className="text-[13px]" value={`${lastMeal?.pequeno_almoco}`}>{lastMeal?.pequeno_almoco}</SelectItem>
                          {lastMeal?.pequeno_almoco_extra1 !== null && lastMeal?.pequeno_almoco_extra1 !== "" ? <SelectItem className="text-[13px]" value={`${lastMeal?.pequeno_almoco_extra1}`}>{lastMeal?.pequeno_almoco_extra1}</SelectItem> : ''}
                          {lastMeal?.pequeno_almoco_extra2 !== null && lastMeal?.pequeno_almoco_extra2 !== "" ? <SelectItem className="text-[13px]" value={`${lastMeal?.pequeno_almoco_extra2}`}>{lastMeal?.pequeno_almoco_extra2}</SelectItem> : ''}
                          {/* <SelectItem className="text-[13px]" value="Mau">Mau</SelectItem> */}
                        </SelectContent>
                      </Select>
                      {/* <FormControl>
                        <Input placeholder="Pequeno-almoço" className="text-[13px]" disabled {...field}
                          defaultValue={state.pequeno_almoco} 
                          />
                      </FormControl> */}
                      <FormMessage />
                    </FormItem>
                  )} />
                <FormField
                  control={form.control}
                  name="porcao_pequeno_almoco"
                  render={({ field }) => (
                    <FormItem className="min-w-[140px]">
                      <FormLabel className="text-[12px]">Porção</FormLabel>
                      <Select onValueChange={(e) => {
                          field.onChange(e);  // Chama o onChange original do field
                          updateField('porcao_pequeno_almoco', e);  // Chama a função que actualiza o estado
                        }}>
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder="..." className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem className="text-[13px]" value="2 Porções">2 Porções</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção e meia">1 Porção e meia</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção">1 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/2 Porção">1/2 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/4 Porção">1/4 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
                        <SelectItem className="text-[13px]" value="Não aplicável">Não aplicável</SelectItem>
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
                      <FormLabel className="text-[12px]">Snack</FormLabel>
                      <Select
                        value={field.value}  // Use value instead of defaultValue
                        onValueChange={(e) => {
                          field.onChange(e);
                          updateField('extras1', e);
                        }} required>
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder={lastMeal?.extras1} className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {lastMeal?.extras1 !== null && lastMeal?.extras1 !== "" ? <SelectItem className="text-[13px]" value={`${lastMeal?.extras1}`}>{lastMeal?.extras1}</SelectItem> : ''}
                          {/* <SelectItem className="text-[13px]" value="Mau">Mau</SelectItem> */}
                        </SelectContent>
                      </Select>
                      {/* <FormControl>
                        <Input placeholder={state.extras1} className="text-[13px]" disabled {...field}
                          defaultValue={state.extras1} />
                      </FormControl> */}
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField
                  control={form.control}
                  name="porcao_extras1"
                  render={({ field }) => (
                    <FormItem className="min-w-[140px]">
                      <FormLabel className="text-[12px]">Porção</FormLabel>
                      <Select onValueChange={(e) => {
                          field.onChange(e);  // Chama o onChange original do field
                          updateField('porcao_extras1', e);  // Chama a função que actualiza o estado
                        }}>
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder="..." className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem className="text-[13px]" value="2 Porções">2 Porções</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção e meia">1 Porção e meia</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção">1 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/2 Porção">1/2 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/4 Porção">1/4 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
                        <SelectItem className="text-[13px]" value="Não aplicável">Não aplicável</SelectItem>
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
                      <FormLabel className="text-[12px]">Almoço (Entrada)</FormLabel>
                      <Select
                        value={state.almoco1}  // Use value instead of defaultValue
                        onValueChange={(e) => {
                          field.onChange(e);
                          updateField('almoco1', e);
                        }} required>
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder={state.almoco1} className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem className="text-[13px]" value={`${lastMeal?.almoco1}`}>{lastMeal?.almoco1}</SelectItem>
                          {lastMeal?.almoco1_extra1 !== null && lastMeal?.almoco1_extra1 !== "" ? <SelectItem className="text-[13px]" value={`${lastMeal?.almoco1_extra1}`}>{lastMeal?.almoco1_extra1}</SelectItem> : ''}
                          {lastMeal?.almoco1_extra2 !== null && lastMeal?.almoco1_extra2 !== "" ? <SelectItem className="text-[13px]" value={`${lastMeal?.almoco1_extra2}`}>{lastMeal?.almoco1_extra2}</SelectItem> : ''}
                          {/* <SelectItem className="text-[13px]" value="Mau">Mau</SelectItem> */}
                        </SelectContent>
                      </Select>
                      {/* <FormControl>
                        <Input placeholder="1º Almoço" className="text-[13px]" disabled {...field}
                          defaultValue={state.almoco1} />
                      </FormControl> */}
                      <FormMessage />
                    </FormItem>
                  )} />
                <FormField
                  control={form.control}
                  name="porcao_almoco1"
                  render={({ field }) => (
                    <FormItem className="min-w-[140px]">
                      <FormLabel className="text-[12px]">Porção</FormLabel>
                      <Select onValueChange={(e) => {
                          field.onChange(e);  // Chama o onChange original do field
                          updateField('porcao_almoco1', e);  // Chama a função que actualiza o estado
                        }}>
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder="..." className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem className="text-[13px]" value="2 Porções">2 Porções</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção e meia">1 Porção e meia</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção">1 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/2 Porção">1/2 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/4 Porção">1/4 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
                        <SelectItem className="text-[13px]" value="Não aplicável">Não aplicável</SelectItem>
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
                      <FormLabel className="text-[12px]">Prato principal</FormLabel>
                      <Select
                        value={field.value}  // Use value instead of defaultValue
                        onValueChange={(e) => {
                          field.onChange(e);
                          updateField('almoco2', e);
                        }} required>
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder="..." className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem className="text-[13px]" value={`${lastMeal?.almoco2}`}>{lastMeal?.almoco2}</SelectItem>
                          {lastMeal?.almoco2_extra1 !== null && lastMeal?.almoco2_extra1 !== "" ? <SelectItem className="text-[13px]" value={`${lastMeal?.almoco2_extra1}`}>{lastMeal?.almoco2_extra1}</SelectItem> : ''}
                          {lastMeal?.almoco2_extra2 !== null && lastMeal?.almoco2_extra2 !== "" ? <SelectItem className="text-[13px]" value={`${lastMeal?.almoco2_extra2}`}>{lastMeal?.almoco2_extra2}</SelectItem> : ''}
                        </SelectContent>
                      </Select>
                      {/* <FormControl>
                        <Input placeholder="Almoço: 2º" className="text-[13px]" disabled {...field}
                          defaultValue={state.almoco2} />
                      </FormControl> */}
                      <FormMessage />
                    </FormItem>
                  )} />
                <FormField
                  control={form.control}
                  name="porcao_almoco2"
                  render={({ field }) => (
                    <FormItem className="min-w-[140px]">
                      <FormLabel className="text-[12px]">Porção</FormLabel>
                      <Select onValueChange={(e) => {
                          field.onChange(e);  // Chama o onChange original do field
                          updateField('porcao_almoco2', e);  // Chama a função que actualiza o estado
                        }}>
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder="..." className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem className="text-[13px]" value="2 Porções">2 Porções</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção e meia">1 Porção e meia</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção">1 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/2 Porção">1/2 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/4 Porção">1/4 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
                        <SelectItem className="text-[13px]" value="Não aplicável">Não aplicável</SelectItem>
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
                      <Select
                        value={field.value}  // Use value instead of defaultValue
                        onValueChange={(e) => {
                          field.onChange(e);
                          updateField('sobremesa', e);
                        }} required>
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder="..." className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem className="text-[13px]" value={`${lastMeal?.sobremesa}`}>{lastMeal?.sobremesa}</SelectItem>
                          
                          {lastMeal?.sobremesa_extra1 !== null && lastMeal?.sobremesa_extra1 !== "" ? <SelectItem className="text-[13px]" value={`${lastMeal?.sobremesa_extra1}`}>{lastMeal?.sobremesa_extra1}</SelectItem> : ''}
                          {lastMeal?.sobremesa_extra2 !== null && lastMeal?.sobremesa_extra2 !== "" ? <SelectItem className="text-[13px]" value={`${lastMeal?.sobremesa_extra2}`}>{lastMeal?.sobremesa_extra2}</SelectItem> : ''}
                          {/* <SelectItem className="text-[13px]" value="Mau">Mau</SelectItem> */}
                        </SelectContent>
                      </Select>
                      {/* <FormControl>
                        <Input placeholder="Sobremesa" className="text-[13px]" disabled {...field}
                          defaultValue={state.sobremesa} />
                      </FormControl> */}
                      <FormMessage />
                    </FormItem>
                  )} />
                <FormField
                  control={form.control}
                  name="porcao_sobremesa"
                  render={({ field }) => (
                    <FormItem className="min-w-[140px]">
                      <FormLabel className="text-[12px]">Porção</FormLabel>
                      <Select onValueChange={(e) => {
                          field.onChange(e);  // Chama o onChange original do field
                          updateField('porcao_sobremesa', e);  // Chama a função que actualiza o estado
                        }}>
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder="..." className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem className="text-[13px]" value="2 Porções">2 Porções</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção e meia">1 Porção e meia</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção">1 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/2 Porção">1/2 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/4 Porção">1/4 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
                        <SelectItem className="text-[13px]" value="Não aplicável">Não aplicável</SelectItem>
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
                      <FormLabel className="text-[12px]">Snack</FormLabel>
                      <Select
                        value={field.value}  // Use value instead of defaultValue
                        onValueChange={(e) => {
                          field.onChange(e);
                          updateField('extras2', e);
                        }} required>
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder={lastMeal?.extras2} className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem className="text-[13px]" value={`${lastMeal?.extras2}`}>{lastMeal?.extras2}</SelectItem>
                          {/* <SelectItem className="text-[13px]" value="Mau">Mau</SelectItem> */}
                        </SelectContent>
                      </Select>
                      {/* <FormControl>
                        <Input placeholder={state.extras2} className="text-[13px]" disabled {...field}
                          defaultValue={state.extras2} />
                      </FormControl> */}
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField
                  control={form.control}
                  name="porcao_extras2"
                  render={({ field }) => (
                    <FormItem className="min-w-[140px]">
                      <FormLabel className="text-[12px]">Porção</FormLabel>
                      <Select onValueChange={(e) => {
                          field.onChange(e);  // Chama o onChange original do field
                          updateField('porcao_extras2', e);  // Chama a função que actualiza o estado
                        }}>
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder="..." className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem className="text-[13px]" value="2 Porções">2 Porções</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção e meia">1 Porção e meia</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção">1 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/2 Porção">1/2 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/4 Porção">1/4 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
                        <SelectItem className="text-[13px]" value="Não aplicável">Não aplicável</SelectItem>
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
                      <Select
                        value={field.value}  // Use value instead of defaultValue
                        onValueChange={(e) => {
                          field.onChange(e);
                          updateField('lanche', e);
                        }} required>
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder="..." className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem className="text-[13px]" value={`${lastMeal?.lanche}`}>{lastMeal?.lanche}</SelectItem>
                          {lastMeal?.lanche_extra1 !== null && lastMeal?.lanche_extra1 !== "" ? <SelectItem className="text-[13px]" value={`${lastMeal?.lanche_extra1}`}>{lastMeal?.lanche_extra1}</SelectItem> : ''}
                          {lastMeal?.lanche_extra2 !== null && lastMeal?.lanche_extra2 !== "" ? <SelectItem className="text-[13px]" value={`${lastMeal?.lanche_extra2}`}>{lastMeal?.lanche_extra2}</SelectItem> : ''}
                        </SelectContent>
                      </Select>
                      {/* <FormControl>
                        <Input placeholder="Lanche" className="text-[13px]" disabled {...field}
                          defaultValue={state.lanche} />
                      </FormControl> */}
                      <FormMessage />
                    </FormItem>
                  )} />
                <FormField
                  control={form.control}
                  name="porcao_lanche"
                  render={({ field }) => (
                    <FormItem className="min-w-[140px]">
                      <FormLabel className="text-[12px]">Porção</FormLabel>
                      <Select onValueChange={(e) => {
                          field.onChange(e);  // Chama o onChange original do field
                          updateField('porcao_lanche', e);  // Chama a função que actualiza o estado
                        }}>
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder="..." className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem className="text-[13px]" value="2 Porções">2 Porções</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção e meia">1 Porção e meia</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção">1 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/2 Porção">1/2 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/4 Porção">1/4 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
                        <SelectItem className="text-[13px]" value="Não aplicável">Não aplicável</SelectItem>
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
                      <FormLabel className="text-[12px]">Fezes</FormLabel>
                      <Select
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
                          <SelectItem className="text-[13px]" value="Não evacuou">Não evacuou</SelectItem>
                          <SelectItem className="text-[13px]" value="Normal">Normal</SelectItem>
                          <SelectItem className="text-[13px]" value="Diarreia">Diarreia</SelectItem>
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
                      <FormLabel className="text-[12px]">Vômitos</FormLabel>
                      <Select
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
                          <SelectItem className="text-[13px]" value="Não">Não</SelectItem>
                          <SelectItem className="text-[13px]" value="Sim">Sim</SelectItem>
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
                          <SelectItem className="text-[13px]" value="Não">Não</SelectItem>
                          <SelectItem className="text-[13px]" value="Sim">Sim</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
              </div>
          </div>

          {state.fezes === "Diarreia" || state.fezes === "Normal" || state.vomitos === "Sim" || state.febres === "Sim" ?
            <div className="flex gap-4 mt-3">
              <div className="w-full border-zinc-200">
              {state.fezes === "Diarreia" || state.fezes === "Normal" ?
              <FormField
                  control={form.control}
                  name="nr_fezes"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-[12px]">Quantas vezes?</FormLabel>
                      <FormControl>
                        <Input placeholder="..." type="number" className="text-[13px]" {...field} min={1} />
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
                  name="nr_vomitos"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-[12px]">Quantas vezes?</FormLabel>
                      <FormControl>
                        <Input placeholder="..." type="number" className="text-[13px]" {...field} min={1} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  : ''}
              </div>
              <div className="w-full border-zinc-200">
              {state.febres === "Sim" ?
              <FormField
                  control={form.control}
                  name="nr_febres"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-[12px]">Temperatura</FormLabel>
                      <FormControl>
                        <Input placeholder="..." className="text-[13px]" {...field} min={1} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  : ''}
              </div>
            </div> : ''
          }

          <div className="grid grid-cols-4 mt-3">
            <div className="col-span-4">
            {/* <CardTitle className="text-left text-[13px] mt-3 md:mt-1">Outras ocorrências</CardTitle> */}
              <div className="flex justify-between gap-4 mt-2">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-[12px]">Outras ocorrências</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Deixe a sua mensagem"
                          className="resize-none text-[13px]"
                          {...field} />
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
  
          <div className="flex mt-5">
            <div className="w-full flex items-center gap-4">
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
              {/*<Button type="button" disabled={saving} onClick={handleReset(state?.behavior, state?.pequeno_almoco)} variant="secondary" className="w-full md:w-fit text-[13px]">
              Limpar campos
            </Button>*/}
            <Button type="submit" disabled={saving} className="w-full md:w-fit flex items-center text-[13px]">
              {saving ? (
                <i className="ri-loader-line animate-spin text-[14px]"></i>
              )
                : (
                  <>
                    {/* <i className="ri-mail-send-line mr-2 text-[14px]"></i> */}
                    Enviar e Guardar
                  </>
                )}
            </Button>
            </div>
          </div> 
        </form>
      </Form>
          </CardContent>
        </Card>
      ) : <></>
    )
  }
}


