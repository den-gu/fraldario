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
import { getStudents } from "@/lib/api"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select"
import { Input } from "./ui/input"
import { CardTitle } from "./ui/card"
import { Form, FormField, FormItem, FormControl, FormMessage } from "./ui/form"
import { Textarea } from "./ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { sendReport } from "@/lib/api"
import { toast } from 'sonner';
import { Label } from "./ui/label"


type Student = {
    id: string | undefined;
    name: string | undefined;
    parent: string | undefined;
    email: string | undefined;
    created_at?: string;
}

interface IGetStudents {
    permLevel: string
}
interface IReport {
  id: string | undefined;
  name: string;
  email: string;
  parent?: string;
}

const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  behavior: z.string().min(3),
  pequenoAlmoco: z.string().optional(),
  almoco1: z.string().optional(),
  almoco2: z.string().optional(),
  sobremesa: z.string().optional(),
  lanche: z.string().optional(),
  porcaoPequenoAlmoco: z.string().optional(),
  porcaoAlmoco1: z.string().optional(),
  porcaoAlmoco2: z.string().optional(),
  porcaoSobremesa: z.string().optional(),
  porcaoLanche: z.string().optional(),
  fezes: z.string().min(2),
  vomitos: z.string().min(2),
  febres: z.string().min(2),
  description: z.string().max(300).optional(),
})

export default function GetStudent(props: IGetStudents) {

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isSendingEmail, setSending] = useState(false)
    const [students, setStudents] = useState<Student[]>([])
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(
        null
    )

    const [isSubmitting, setSubmitting] = useState(false)

  // Declarando múltiplos estados como propriedades de um objeto
  const [state, setState] = useState({
    name: "",
    email: "",
    behavior: "",
    pequenoAlmoco: "",
    almoco1: "",
    almoco2: "",
    sobremesa: "",
    lanche: "",
    porcaoPequenoAlmoco: "",
    porcaoAlmoco1: "",
    porcaoAlmoco2: "",
    porcaoSobremesa: "",
    porcaoLanche: "",
    fezes: "",
    vomitos: "",
    febres: "",
    description: "" 
  })
  

  const loadHandler = (state: boolean) => {
    setLoading(!state)
  }

  const sendingHandler = (state: boolean) => {
    setSending(!state)
    setTimeout(() => {
      toast('Sucesso', {
        description: 'O e-mail foi enviado.',
        duration: 5000,
        cancel: {
          label: 'Fechar',
          onClick: () => console.log('Cancel!'),
        },
      })
      setSending(state)
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
      name: "",
      email: "",
      behavior: "",
      pequenoAlmoco: "",
      almoco1: "",
      almoco2: "",
      sobremesa: "",
      lanche: "",
      porcaoPequenoAlmoco: "",
      porcaoAlmoco1: "",
      porcaoAlmoco2: "",
      porcaoSobremesa: "",
      porcaoLanche: "",
      fezes: "",
      vomitos: "",
      febres: "",
      description: ""
    },
  })

  const downloadPDF = () => {

    loadHandler(loading);

    const doc = new jsPDF('l');
    const date = new Date();
    const createdAt = new Intl.DateTimeFormat('pt-BR').format(date);
    
    doc.setFontSize(10);
    doc.text('O Fraldario', 14, 25);
    doc.text(`Data: ${createdAt}`, 190, 25, {align: 'right'});
    doc.text(`Nome da criança: ${state.name}`, 14, 30);
    doc.text(`Comportamento: ${state.behavior}`, 190, 30, {align: 'right'});

    doc.text(`Refeição/Porção`, 14, 40);

    // Generate the table
    autoTable(doc, {
      head: [["Pequeno-almoço", "Almoço: 1º", "Almoço: 2º", "Sobremesa", "Lanche"]],
      theme: 'striped',
      styles: {
        fontSize: 10
      },
      margin: { top: 43 },
      body: [
        [`${state.pequenoAlmoco}`, `${state.almoco1}`, `${state.almoco2}`, `${state.sobremesa}`, `${state.lanche}`],
        [`${state.porcaoPequenoAlmoco}`, `${state.porcaoAlmoco1}`, `${state.porcaoAlmoco2}`, `${state.porcaoSobremesa}`, `${state.porcaoLanche}`],
      ],
    })
    
    doc.text(`Fezes: ${state.fezes}             Vômitos: ${state.vomitos}             Febres: ${state.febres}`, 14, 75);
    doc.text(`Outras ocorrências: ${state.description}`, 14, 85);

    setTimeout(() => {
      loadHandler(!loading);
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
      sendingHandler(isSendingEmail);
      await sendReport(values);
    } catch (error) {
      console.log(error)
    }
  }


    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const response = await getStudents();
                const { data } = await response?.json();
                setStudents(data);

                console.log(data)
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []);

    if (isDesktop) {
                return (
                    <React.Fragment>
                        <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="secondary" className="w-full justify-start text-[13px]">
                                {selectedStudent ? 
                                    <div className="flex items-center gap-2"><i className="ri-search-line"></i>{selectedStudent.name}</div>
                                    : <div className="flex items-center gap-2"><i className="ri-search-line"></i>Pesquisar</div>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="start">
                            <StudentsList setOpen={setOpen} setSelectedStudent={setSelectedStudent} />
                        </PopoverContent>
                    </Popover>
                    {selectedStudent ? 
                    <StudentData id={selectedStudent?.id} name={selectedStudent?.name} parent={selectedStudent?.parent} email={selectedStudent?.email} />
                    : ''}
                    </React.Fragment>
                )
            }
        
            return (
                <React.Fragment>
                    <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger asChild>
                    <Button variant="secondary" className="w-full justify-start text-[13px]">
                                {selectedStudent ? 
                                    <div className="flex items-center gap-2"><i className="ri-search-line"></i>{selectedStudent.name}</div>
                                    : <div className="flex items-center gap-2"><i className="ri-search-line"></i>Pesquisar</div>}
                            </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <div className="mt-4 border-t">
                            <StudentsList setOpen={setOpen} setSelectedStudent={setSelectedStudent} />
                        </div>
                    </DrawerContent>
                </Drawer>
                {selectedStudent ? 
                    <StudentData id={selectedStudent?.id} name={selectedStudent?.name} parent={selectedStudent?.parent} email={selectedStudent?.email} />
                    : ''}
                </React.Fragment>
            )

            function StudentData(data: Student, { className }: React.ComponentProps<"form">) {
                return (
                    selectedStudent ? 
                    (
                        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="h-auto">
            <div className="grid gap-7 grid-cols-4 mt-5">
                <div className="col-span-3">
                <div className="flex flex-col gap-3">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                    <CardTitle className="text-left text-[13px]">Nome da criança</CardTitle>
                      <FormControl>
                        <Input defaultValue={data?.name} placeholder={data?.name} disabled {...field}
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
                      <CardTitle className="text-left text-[13px]">Comportamento</CardTitle>
                      <Select
                      //  defaultValue={field.value}
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
                  )} />
              </div>
  
              <CardTitle className="text-left text-[13px]">Refeição/Porção</CardTitle>
              <div className="flex justify-between gap-4">
                <FormField
                  control={form.control}
                  name="pequenoAlmoco"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      {/* <FormLabel className="text-muted-foreground text-[13px]">Pequeno-almoço</FormLabel> */}
                      <FormControl>
                        <Input placeholder="Pequeno-almoço" className="text-[13px]" {...field}
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
                      {/* <FormLabel className="text-muted-foreground text-[13px]">Porção</FormLabel> */}
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
                        <SelectItem className="text-[13px]" value="Inteira">Inteira</SelectItem>
                        <SelectItem className="text-[13px]" value="Meia">Meia</SelectItem>
                        <SelectItem className="text-[13px]" value="Menos">Menos</SelectItem>
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
                      {/* <FormLabel className="text-muted-foreground text-[13px]">Almoço: 1º</FormLabel> */}
                      <FormControl>
                        <Input placeholder="Almoço: 1º" className="text-[13px]" {...field}
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
                      {/* <FormLabel className="text-muted-foreground text-[13px]">Porção</FormLabel> */}
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
                        <SelectItem className="text-[13px]" value="Inteira">Inteira</SelectItem>
                        <SelectItem className="text-[13px]" value="Meia">Meia</SelectItem>
                        <SelectItem className="text-[13px]" value="Menos">Menos</SelectItem>
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
                      {/* <FormLabel className="text-muted-foreground text-[13px]">Almoço: 2º</FormLabel> */}
                      <FormControl>
                        <Input placeholder="Almoço: 2º" className="text-[13px]" {...field}
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
                      {/* <FormLabel className="text-muted-foreground text-[13px]">Porção</FormLabel> */}
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
                        <SelectItem className="text-[13px]" value="Inteira">Inteira</SelectItem>
                        <SelectItem className="text-[13px]" value="Meia">Meia</SelectItem>
                        <SelectItem className="text-[13px]" value="Menos">Menos</SelectItem>
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
                      {/* <FormLabel className="text-muted-foreground text-[13px]">Sobremesa</FormLabel> */}
                      <FormControl>
                        <Input placeholder="Sobremesa" className="text-[13px]" {...field}
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
                      {/* <FormLabel className="text-muted-foreground text-[13px]">Porção</FormLabel> */}
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
                        <SelectItem className="text-[13px]" value="Inteira">Inteira</SelectItem>
                        <SelectItem className="text-[13px]" value="Meia">Meia</SelectItem>
                        <SelectItem className="text-[13px]" value="Menos">Menos</SelectItem>
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
                      {/* <FormLabel className="text-muted-foreground text-[13px]">Lanche</FormLabel> */}
                      <FormControl>
                        <Input placeholder="Lanche" className="text-[13px]" {...field}
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
                      {/* <FormLabel className="text-muted-foreground text-[13px]">Porção</FormLabel> */}
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
                        <SelectItem className="text-[13px]" value="Inteira">Inteira</SelectItem>
                        <SelectItem className="text-[13px]" value="Meia">Meia</SelectItem>
                        <SelectItem className="text-[13px]" value="Menos">Menos</SelectItem>
                        <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
                      </SelectContent>
                    </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
              </div>
  
              <CardTitle className="text-left text-[13px]">Outras ocorrências</CardTitle>
              <div className="flex justify-between gap-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      {/* <FormLabel className="text-muted-foreground text-[13px]">Porção</FormLabel> */}
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
                {/* <div className=""> */}
                <div className="flex flex-col gap-4">
              <div className="w-full border-zinc-200">
                  <FormField
                  control={form.control}
                  name="fezes"
                  render={({ field }) => (
                    <FormItem className="min-w-[140px]">
                      <CardTitle className="text-left text-[13px]">Fezes</CardTitle>
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
                      <CardTitle className="text-left text-[13px]">Vômitos</CardTitle>
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
                      <CardTitle className="text-left text-[13px]">Febres</CardTitle>
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
                </div>
            {/* </div> */}
              {/* <div className="flex flex-col lg:flex-row items-start gap-2 lg:gap-5"> */}
              {/* </div> */}
  
              <div className="flex items-center gap-4 mt-5">
                <Button type="button" onClick={() => downloadPDF()} disabled={loading} variant="secondary" className="w-full md:w-fit flex items-center text-[13px]">
                  {loading ? (
                    <i className="ri-loader-line animate-spin text-[16px]"></i>
                  )
                  : (
                    <>
                      <i className="ri-download-line mr-2 text-[15px]"></i>
                      Baixar
                    </>
                  )}
                </Button>
                <Button type="submit" disabled={isSendingEmail} className="w-full md:w-fit flex items-center text-[13px]">
                {isSendingEmail ? (
                    <i className="ri-loader-line animate-spin text-[16px]"></i>
                  )
                  : (
                    <>
                      <i className="ri-mail-send-line mr-2 text-[15px]"></i>
                      Enviar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form> 
                    )
                    : <p>Nothing to show</p>
                )
            }

            function StudentsList({
                        setOpen,
                        setSelectedStudent,
                    }: {
                        setOpen: (open: boolean) => void
                        setSelectedStudent: (student: Student | null) => void
                    }) {
                        return (
                            <Command className="w-full">
                                <CommandInput
                                className="w-full"
                                 placeholder="Digite o nome" />
                                <CommandList>
                                    <CommandEmpty>No results found.</CommandEmpty>
                                    <CommandGroup>
                                        {students.map((student) => (
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
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        )
            }
}

// function StudentData(data: IReport, { className }: React.ComponentProps<"form">) {

//   const [isSubmitting, setSubmitting] = useState(false)

//   // Declarando múltiplos estados como propriedades de um objeto
//   const [state, setState] = useState({
//     name: data.name,
//     email: data.email,
//     behavior: "",
//     pequenoAlmoco: "",
//     almoco1: "",
//     almoco2: "",
//     sobremesa: "",
//     lanche: "",
//     porcaoPequenoAlmoco: "",
//     porcaoAlmoco1: "",
//     porcaoAlmoco2: "",
//     porcaoSobremesa: "",
//     porcaoLanche: "",
//     fezes: "",
//     vomitos: "",
//     febres: "",
//     description: "" 
//   })

//   const [isLoading, setLoading] = useState(false)
//   const [isSendingEmail, setSending] = useState(false)
  

//   const loadHandler = (state: boolean) => {
//     setLoading(!state)
//   }

//   const sendingHandler = (state: boolean) => {
//     setSending(!state)
//     setTimeout(() => {
//       toast('Sucesso', {
//         description: 'O e-mail foi enviado.',
//         duration: 5000,
//         cancel: {
//           label: 'Fechar',
//           onClick: () => console.log('Cancel!'),
//         },
//       })
//       setSending(state)
//     }, 2000);
//   }

//   // Modificando um dos estados
//   const updateField = (field: any, value: any) => {
//     setState((prevState) => ({
//       ...prevState,
//       [field]: value,
//     }));
//   };

//   // 1. Define your form.
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: data.name,
//       email: data.email,
//       behavior: "",
//       pequenoAlmoco: "",
//       almoco1: "",
//       almoco2: "",
//       sobremesa: "",
//       lanche: "",
//       porcaoPequenoAlmoco: "",
//       porcaoAlmoco1: "",
//       porcaoAlmoco2: "",
//       porcaoSobremesa: "",
//       porcaoLanche: "",
//       fezes: "",
//       vomitos: "",
//       febres: "",
//       description: ""
//     },
//   })

//   const downloadPDF = () => {

//     loadHandler(isLoading);

//     const doc = new jsPDF('l');
//     const date = new Date();
//     const createdAt = new Intl.DateTimeFormat('pt-BR').format(date);
    
//     doc.setFontSize(10);
//     doc.text('O Fraldario', 14, 25);
//     doc.text(`Data: ${createdAt}`, 190, 25, {align: 'right'});
//     doc.text(`Nome da criança: ${state.name}`, 14, 30);
//     doc.text(`Comportamento: ${state.behavior}`, 190, 30, {align: 'right'});

//     doc.text(`Refeição/Porção`, 14, 40);

//     // Generate the table
//     autoTable(doc, {
//       head: [["Pequeno-almoço", "Almoço: 1º", "Almoço: 2º", "Sobremesa", "Lanche"]],
//       theme: 'striped',
//       styles: {
//         fontSize: 10
//       },
//       margin: { top: 43 },
//       body: [
//         [`${state.pequenoAlmoco}`, `${state.almoco1}`, `${state.almoco2}`, `${state.sobremesa}`, `${state.lanche}`],
//         [`${state.porcaoPequenoAlmoco}`, `${state.porcaoAlmoco1}`, `${state.porcaoAlmoco2}`, `${state.porcaoSobremesa}`, `${state.porcaoLanche}`],
//       ],
//     })
    
//     doc.text(`Fezes: ${state.fezes}             Vômitos: ${state.vomitos}             Febres: ${state.febres}`, 14, 75);
//     doc.text(`Outras ocorrências: ${state.description}`, 14, 85);

//     setTimeout(() => {
//       loadHandler(!isLoading);
//       // Save the PDF
//       doc.save(`Relatorio-${createdAt}-${state.name}.pdf`);
//       toast('Sucesso', {
//         description: 'O ficheiro foi descarregado.',
//         duration: 5000,
//         cancel: {
//           label: 'Fechar',
//           onClick: () => console.log('Closed!'),
//         },
//       })
//     }, 2000);
//   }

//   // 2. Define a submit handler.
//   async function onSubmit(values: z.infer<typeof formSchema>) {

//     try {
//       sendingHandler(isSendingEmail);
//       await sendReport(values);
//     } catch (error) {
//       console.log(error)
//     }
//   }

  
//     return (
//       <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="flex-col h-auto gap-6 px-6 pb-3">
//               <div className="flex flex-col items-start gap-2 lg:gap-5">
//               <div className="flex flex-col w-full gap-2 pt-2 h-full">
//               <div className="flex gap-4">
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem className="w-full">
//                     <CardTitle className="text-left text-[13px] mt-3">Nome da criança</CardTitle>
//                       <FormControl> 
//                         <Input defaultValue={data.name} placeholder={data.name} disabled {...field}
//                         className="disabled:placeholder:text-[#000000]" />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                 <FormField
//                   control={form.control}
//                   name="behavior"
//                   render={({ field }) => (
//                     <FormItem className="min-w-[140px]">
//                       <CardTitle className="text-left text-[13px] mt-3">Comportamento</CardTitle>
//                       <Select
//                       //  defaultValue={field.value}
//                        onValueChange={(e) => {
//                         field.onChange(e);  // Chama o onChange original do field
//                         updateField('behavior', e);  // Chama a função que actualiza o estado
//                       }} required>
//                       <FormControl>
//                         <SelectTrigger className="w-full text-[13px]">
//                           <SelectValue placeholder="" {...field} />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem className="text-[13px]" value="Bom">Bom</SelectItem>
//                         <SelectItem className="text-[13px]" value="Mau">Mau</SelectItem>
//                       </SelectContent>
//                     </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//               </div>
  
//               <CardTitle className="text-left text-[13px] mt-3 md:mt-1">Refeição/Porção</CardTitle>
//               <div className="flex justify-between gap-4">
//                 <FormField
//                   control={form.control}
//                   name="pequenoAlmoco"
//                   render={({ field }) => (
//                     <FormItem className="w-full">
//                       {/* <FormLabel className="text-muted-foreground text-[13px]">Pequeno-almoço</FormLabel> */}
//                       <FormControl>
//                         <Input placeholder="Pequeno-almoço" className="text-[13px]" {...field}
//                         defaultValue={state.pequenoAlmoco}
//                         // value={state.pequenoAlmoco}
//                         onChange={(e) => {
//                           field.onChange(e);  // Chama o onChange original do field
//                           updateField('pequenoAlmoco', e.target.value);  // Chama a função que actualiza o estado
//                         }} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                 <FormField
//                   control={form.control}
//                   name="porcaoPequenoAlmoco"
//                   render={({ field }) => (
//                     <FormItem className="min-w-[140px]">
//                       {/* <FormLabel className="text-muted-foreground text-[13px]">Porção</FormLabel> */}
//                       <Select
//                        defaultValue={state.porcaoPequenoAlmoco}
//                        onValueChange={(e) => {
//                         field.onChange(e);  // Chama o onChange original do field
//                         updateField('porcaoPequenoAlmoco', e);  // Chama a função que actualiza o estado
//                       }} >
//                       <FormControl>
//                         <SelectTrigger className="w-full text-[13px]">
//                           <SelectValue placeholder="..." className="text-[13px]" {...field} />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem className="text-[13px]" value="Inteira">Inteira</SelectItem>
//                         <SelectItem className="text-[13px]" value="Meia">Meia</SelectItem>
//                         <SelectItem className="text-[13px]" value="Menos">Menos</SelectItem>
//                         <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
//                       </SelectContent>
//                     </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//               </div>
  
//               <div className="flex justify-between gap-4">
//                 <FormField
//                   control={form.control}
//                   name="almoco1"
//                   render={({ field }) => (
//                     <FormItem className="w-full">
//                       {/* <FormLabel className="text-muted-foreground text-[13px]">Almoço: 1º</FormLabel> */}
//                       <FormControl>
//                         <Input placeholder="Almoço: 1º" className="text-[13px]" {...field}
//                         defaultValue={state.almoco1}
//                         // value={state.almoco1}
//                         onChange={(e) => {
//                           field.onChange(e);  // Chama o onChange original do field
//                           updateField('almoco1', e.target.value);  // Chama a função que actualiza o estado
//                         }} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                   <FormField
//                   control={form.control}
//                   name="porcaoAlmoco1"
//                   render={({ field }) => (
//                     <FormItem className="min-w-[140px]">
//                       {/* <FormLabel className="text-muted-foreground text-[13px]">Porção</FormLabel> */}
//                       <Select
//                        defaultValue={state.porcaoAlmoco1}
//                        onValueChange={(e) => {
//                         field.onChange(e);  // Chama o onChange original do field
//                         updateField('porcaoAlmoco1', e);  // Chama a função que actualiza o estado
//                       }} >
//                       <FormControl>
//                         <SelectTrigger className="w-full text-[13px]">
//                           <SelectValue placeholder="..." className="text-[13px]" {...field} />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem className="text-[13px]" value="Inteira">Inteira</SelectItem>
//                         <SelectItem className="text-[13px]" value="Meia">Meia</SelectItem>
//                         <SelectItem className="text-[13px]" value="Menos">Menos</SelectItem>
//                         <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
//                       </SelectContent>
//                     </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//               </div>
  
              
//               <div className="flex justify-between gap-4">
//                 <FormField
//                   control={form.control}
//                   name="almoco2"
//                   render={({ field }) => (
//                     <FormItem className="w-full">
//                       {/* <FormLabel className="text-muted-foreground text-[13px]">Almoço: 2º</FormLabel> */}
//                       <FormControl>
//                         <Input placeholder="Almoço: 2º" className="text-[13px]" {...field}
//                         defaultValue={state.almoco2}
//                         // value={state.almoco2}
//                         onChange={(e) => {
//                           field.onChange(e);  // Chama o onChange original do field
//                           updateField('almoco2', e.target.value);  // Chama a função que actualiza o estado
//                         }} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                   <FormField
//                   control={form.control}
//                   name="porcaoAlmoco2"
//                   render={({ field }) => (
//                     <FormItem className="min-w-[140px]">
//                       {/* <FormLabel className="text-muted-foreground text-[13px]">Porção</FormLabel> */}
//                       <Select
//                        defaultValue={state.porcaoAlmoco2}
//                        onValueChange={(e) => {
//                         field.onChange(e);  // Chama o onChange original do field
//                         updateField('porcaoAlmoco2', e);  // Chama a função que actualiza o estado
//                       }} >
//                       <FormControl>
//                         <SelectTrigger className="w-full text-[13px]">
//                           <SelectValue placeholder="..." className="text-[13px]" {...field} />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem className="text-[13px]" value="Inteira">Inteira</SelectItem>
//                         <SelectItem className="text-[13px]" value="Meia">Meia</SelectItem>
//                         <SelectItem className="text-[13px]" value="Menos">Menos</SelectItem>
//                         <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
//                       </SelectContent>
//                     </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//               </div>
  
              
//               <div className="flex justify-between gap-4">
//               <FormField
//                   control={form.control}
//                   name="sobremesa"
//                   render={({ field }) => (
//                     <FormItem className="w-full">
//                       {/* <FormLabel className="text-muted-foreground text-[13px]">Sobremesa</FormLabel> */}
//                       <FormControl>
//                         <Input placeholder="Sobremesa" className="text-[13px]" {...field}
//                         defaultValue={state.sobremesa}
//                         // value={state.sobremesa}
//                         onChange={(e) => {
//                           field.onChange(e);  // Chama o onChange original do field
//                           updateField('sobremesa', e.target.value);  // Chama a função que actualiza o estado
//                         }} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                   <FormField
//                   control={form.control}
//                   name="porcaoSobremesa"
//                   render={({ field }) => (
//                     <FormItem className="min-w-[140px]">
//                       {/* <FormLabel className="text-muted-foreground text-[13px]">Porção</FormLabel> */}
//                       <Select
//                        defaultValue={state.porcaoSobremesa}
//                        onValueChange={(e) => {
//                         field.onChange(e);  // Chama o onChange original do field
//                         updateField('porcaoSobremesa', e);  // Chama a função que actualiza o estado
//                       }} >
//                       <FormControl>
//                         <SelectTrigger className="w-full text-[13px]">
//                           <SelectValue placeholder="..." className="text-[13px]" {...field} />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem className="text-[13px]" value="Inteira">Inteira</SelectItem>
//                         <SelectItem className="text-[13px]" value="Meia">Meia</SelectItem>
//                         <SelectItem className="text-[13px]" value="Menos">Menos</SelectItem>
//                         <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
//                       </SelectContent>
//                     </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//               </div>
  
//               <div className="flex justify-between gap-4">
//                 <FormField
//                   control={form.control}
//                   name="lanche"
//                   render={({ field }) => (
//                     <FormItem className="w-full">
//                       {/* <FormLabel className="text-muted-foreground text-[13px]">Lanche</FormLabel> */}
//                       <FormControl>
//                         <Input placeholder="Lanche" className="text-[13px]" {...field}
//                         defaultValue={state.lanche}
//                         // value={state.lanche}
//                         onChange={(e) => {
//                           field.onChange(e);  // Chama o onChange original do field
//                           updateField('lanche', e.target.value);  // Chama a função que actualiza o estado
//                         }} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                   <FormField
//                   control={form.control}
//                   name="porcaoLanche"
//                   render={({ field }) => (
//                     <FormItem className="min-w-[140px]">
//                       {/* <FormLabel className="text-muted-foreground text-[13px]">Porção</FormLabel> */}
//                       <Select
//                        defaultValue={state.porcaoLanche}
//                        onValueChange={(e) => {
//                         field.onChange(e);  // Chama o onChange original do field
//                         updateField('porcaoLanche', e);  // Chama a função que actualiza o estado
//                       }} >
//                       <FormControl>
//                         <SelectTrigger className="w-full text-[13px]">
//                           <SelectValue placeholder="..." className="text-[13px]" {...field} />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem className="text-[13px]" value="Inteira">Inteira</SelectItem>
//                         <SelectItem className="text-[13px]" value="Meia">Meia</SelectItem>
//                         <SelectItem className="text-[13px]" value="Menos">Menos</SelectItem>
//                         <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
//                       </SelectContent>
//                     </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//               </div>
  
//               <CardTitle className="text-left text-[13px] mt-3 md:mt-1">Outras ocorrências</CardTitle>
//               <div className="flex justify-between gap-4">
//                 <FormField
//                   control={form.control}
//                   name="description"
//                   render={({ field }) => (
//                     <FormItem className="w-full">
//                       {/* <FormLabel className="text-muted-foreground text-[13px]">Porção</FormLabel> */}
//                       <FormControl>
//                   <Textarea
//                     placeholder="Deixe a sua mensagem"
//                     className="resize-none text-[13px]"
//                     {...field}
//                     defaultValue={state.description}
//                     // value={state.description}
//                         onChange={(e) => {
//                           field.onChange(e);  // Chama o onChange original do field
//                           updateField('description', e.target.value);  // Chama a função que actualiza o estado
//                         }}
//                   />
//                 </FormControl>
//                 {/* <FormDescription>
//                   You can <span>@mention</span> other users and organizations.
//                 </FormDescription> */}
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//               </div>
//               </div>
  
//               <div className="flex items-center justify-between gap-2 w-full">
//               <div className="w-full border-zinc-200 h-full">
//                   <FormField
//                   control={form.control}
//                   name="fezes"
//                   render={({ field }) => (
//                     <FormItem className="min-w-[140px]">
//                       <CardTitle className="text-left text-[13px]">Fezes</CardTitle>
//                       <Select
//                       defaultValue={state.fezes}
//                        onValueChange={(e) => {
//                         field.onChange(e);  // Chama o onChange original do field
//                         updateField('fezes', e);  // Chama a função que actualiza o estado
//                       }} required>
//                       <FormControl>
//                         <SelectTrigger className="w-full text-[13px]">
//                           <SelectValue placeholder="..." className="text-[13px]" {...field} />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem className="text-[13px]" value="Normal">Normal</SelectItem>
//                         <SelectItem className="text-[13px]" value="Diarreia">Diarreia</SelectItem>
//                         <SelectItem className="text-[13px]" value="Não evacuou">Não evacuou</SelectItem>
//                       </SelectContent>
//                     </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//               </div>
//               <div className="w-full border-zinc-200 h-full">
//                   <FormField
//                   control={form.control}
//                   name="vomitos"
//                   render={({ field }) => (
//                     <FormItem className="min-w-[140px]">
//                       <CardTitle className="text-left text-[13px]">Vômitos</CardTitle>
//                       <Select
//                       defaultValue={state.vomitos}
//                        onValueChange={(e) => {
//                         field.onChange(e);  // Chama o onChange original do field
//                         updateField('vomitos', e);  // Chama a função que actualiza o estado
//                       }} required>
//                       <FormControl>
//                         <SelectTrigger className="w-full text-[13px]">
//                           <SelectValue placeholder="..." className="text-[13px]" {...field} />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem className="text-[13px]" value="Sim">Sim</SelectItem>
//                         <SelectItem className="text-[13px]" value="Não">Não</SelectItem>
//                       </SelectContent>
//                     </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//               </div>
//               <div className="w-full border-zinc-200 h-full">
//                   <FormField
//                   control={form.control}
//                   name="febres"
//                   render={({ field }) => (
//                     <FormItem className="min-w-[140px]">
//                       <CardTitle className="text-left text-[13px]">Febres</CardTitle>
//                       <Select
//                       defaultValue={state.febres}
//                        onValueChange={(e) => {
//                         field.onChange(e);  // Chama o onChange original do field
//                         updateField('febres', e);  // Chama a função que actualiza o estado
//                       }} required>
//                       <FormControl>
//                         <SelectTrigger className="w-full text-[13px]">
//                           <SelectValue placeholder="..." className="text-[13px]" {...field} />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem className="text-[13px]" value="Sim">Sim</SelectItem>
//                         <SelectItem className="text-[13px]" value="Não">Não</SelectItem>
//                       </SelectContent>
//                     </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//               </div>
//               </div>
//               </div>
  
//               <div className="flex justify-end items-center gap-4 mt-5">
//                 <Button type="button" onClick={() => downloadPDF()} disabled={isLoading} variant="secondary" className="w-full md:w-fit flex items-center text-[12px]">
//                   {isLoading ? (
//                     <i className="ri-loader-line animate-spin text-[14px]"></i>
//                   )
//                   : (
//                     <>
//                       <i className="ri-download-line mr-2 text-[14px]"></i>
//                       Baixar
//                     </>
//                   )}
//                 </Button>
//                 <Button type="submit" disabled={isSendingEmail} className="w-full md:w-fit flex items-center text-[12px]">
//                 {isSendingEmail ? (
//                     <i className="ri-loader-line animate-spin text-[14px]"></i>
//                   )
//                   : (
//                     <>
//                       <i className="ri-mail-send-line mr-2 text-[14px]"></i>
//                       Enviar
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </Form>
//     )
// }


// export function Repo(props: IGetStudents) {
//     const [open, setOpen] = useState(false)
//     const [loading, setLoading] = useState(false)
//     const [data, setData] = useState<Student[]>([])
//     const isDesktop = useMediaQuery("(min-width: 768px)")
//     const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(
//         null
//     )

//     useEffect(() => {
//         const getData = async () => {
//             setLoading(true);
//             try {
//                 const response = await getStudents();
//                 const { data } = await response?.json();
//                 setData(data);

//                 console.log(data)
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         getData();
//     }, []);


//     if (isDesktop) {
//         return (
//             <React.Fragment>
//                 <Popover open={open} onOpenChange={setOpen}>
//                 <PopoverTrigger asChild>
//                     <Button variant="outline" className="w-[200px] justify-start">
//                         {selectedStudent ? <>{selectedStudent.name}</>
//                             : <div className="flex items-center gap-2"><i className="ri-search-line"></i>Pesquisar</div>}
//                     </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-[200px] p-0" align="start">
//                     <StudentsList setOpen={setOpen} setSelectedStudent={setSelectedStudent} />
//                 </PopoverContent>
//             </Popover>
//             {/* {printUserInfo()} */}
//             </React.Fragment>
//         )
//     }

//     return (
//         <Drawer open={open} onOpenChange={setOpen}>
//             <DrawerTrigger asChild>
//                 <Button variant="outline" className="w-full justify-start">
//                     {selectedStudent ? <>{selectedStudent.name}</> : <>+ Set status</>}
//                 </Button>
//             </DrawerTrigger>
//             <DrawerContent>
//                 <div className="mt-4 border-t">
//                     <StudentsList setOpen={setOpen} setSelectedStudent={setSelectedStudent} />
//                 </div>
//             </DrawerContent>
//         </Drawer>
//     )



//     function StudentsList({
//         setOpen,
//         setSelectedStudent,
//     }: {
//         setOpen: (open: boolean) => void
//         setSelectedStudent: (student: Student | null) => void
//     }) {
//         return (
//             <Command>
//                 <CommandInput
//                  placeholder="Digite o nome" />
//                 <CommandList>
//                     <CommandEmpty>No results found.</CommandEmpty>
//                     <CommandGroup>
//                         {data.map((student) => (
//                             <CommandItem
//                                 key={student.id}
//                                 value={student.name}
//                                 onSelect={(value) => {
//                                     setSelectedStudent(
//                                         data.find((priority) => priority.id === student.id) || null
//                                     )
//                                     setOpen(false)
//                                 }}
//                             >
//                                 {student.name}
//                             </CommandItem>
//                         ))}
//                     </CommandGroup>
//                 </CommandList>
//             </Command>
//         )
//     }
// }


//   async function onSubmit(values: z.infer<typeof formSchema>) {

//     // 1. Define your form.
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       behavior: "",
//       pequenoAlmoco: "",
//       almoco1: "",
//       almoco2: "",
//       sobremesa: "",
//       lanche: "",
//       porcaoPequenoAlmoco: "",
//       porcaoAlmoco1: "",
//       porcaoAlmoco2: "",
//       porcaoSobremesa: "",
//       porcaoLanche: "",
//       fezes: "",
//       vomitos: "",
//       febres: "",
//       description: ""
//     },
//   })

//     try {
//         // sendingHandler(isSendingEmail);
//         // await sendReport(values);
//       } catch (error) {
//         console.log(error)
//       }

//     return (
//         <div className="user-info">
//                 {
//                     selectedStudent ? (
//         <Form {...form}>
//         <form className="flex-col h-auto gap-6 px-6 pb-3">
//           <div className="flex flex-col items-start gap-2 lg:gap-5">
//           <div className="flex flex-col w-full gap-2 pt-2 h-full">
//           <div className="flex gap-4">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                 <CardTitle className="text-left text-[13px] mt-3">Nome da criança</CardTitle>
//                   <FormControl>
//                     <Input defaultValue={data.name} placeholder={data.name} disabled {...field}
//                     className="disabled:placeholder:text-[#000000]" />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//             <FormField
//               control={form.control}
//               name="behavior"
//               render={({ field }) => (
//                 <FormItem className="min-w-[140px]">
//                   <CardTitle className="text-left text-[13px] mt-3">Comportamento</CardTitle>
//                   <Select
//                   //  defaultValue={field.value}
//                    onValueChange={(e) => {
//                     field.onChange(e);  // Chama o onChange original do field
//                     updateField('behavior', e);  // Chama a função que actualiza o estado
//                   }} required>
//                   <FormControl>
//                     <SelectTrigger className="w-full text-[13px]">
//                       <SelectValue placeholder="" {...field} />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem className="text-[13px]" value="Bom">Bom</SelectItem>
//                     <SelectItem className="text-[13px]" value="Mau">Mau</SelectItem>
//                   </SelectContent>
//                 </Select>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//           </div>

//           <CardTitle className="text-left text-[13px] mt-3 md:mt-1">Refeição/Porção</CardTitle>
//           <div className="flex justify-between gap-4">
//             <FormField
//               control={form.control}
//               name="pequenoAlmoco"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   {/* <FormLabel className="text-muted-foreground text-[13px]">Pequeno-almoço</FormLabel> */}
//                   <FormControl>
//                     <Input placeholder="Pequeno-almoço" className="text-[13px]" {...field}
//                     defaultValue={state.pequenoAlmoco}
//                     // value={state.pequenoAlmoco}
//                     onChange={(e) => {
//                       field.onChange(e);  // Chama o onChange original do field
//                       updateField('pequenoAlmoco', e.target.value);  // Chama a função que actualiza o estado
//                     }} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//             <FormField
//               control={form.control}
//               name="porcaoPequenoAlmoco"
//               render={({ field }) => (
//                 <FormItem className="min-w-[140px]">
//                   {/* <FormLabel className="text-muted-foreground text-[13px]">Porção</FormLabel> */}
//                   <Select
//                    defaultValue={state.porcaoPequenoAlmoco}
//                    onValueChange={(e) => {
//                     field.onChange(e);  // Chama o onChange original do field
//                     updateField('porcaoPequenoAlmoco', e);  // Chama a função que actualiza o estado
//                   }} >
//                   <FormControl>
//                     <SelectTrigger className="w-full text-[13px]">
//                       <SelectValue placeholder="..." className="text-[13px]" {...field} />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem className="text-[13px]" value="Inteira">Inteira</SelectItem>
//                     <SelectItem className="text-[13px]" value="Meia">Meia</SelectItem>
//                     <SelectItem className="text-[13px]" value="Menos">Menos</SelectItem>
//                     <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
//                   </SelectContent>
//                 </Select>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//           </div>

//           <div className="flex justify-between gap-4">
//             <FormField
//               control={form.control}
//               name="almoco1"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   {/* <FormLabel className="text-muted-foreground text-[13px]">Almoço: 1º</FormLabel> */}
//                   <FormControl>
//                     <Input placeholder="Almoço: 1º" className="text-[13px]" {...field}
//                     defaultValue={state.almoco1}
//                     // value={state.almoco1}
//                     onChange={(e) => {
//                       field.onChange(e);  // Chama o onChange original do field
//                       updateField('almoco1', e.target.value);  // Chama a função que actualiza o estado
//                     }} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//               <FormField
//               control={form.control}
//               name="porcaoAlmoco1"
//               render={({ field }) => (
//                 <FormItem className="min-w-[140px]">
//                   {/* <FormLabel className="text-muted-foreground text-[13px]">Porção</FormLabel> */}
//                   <Select
//                    defaultValue={state.porcaoAlmoco1}
//                    onValueChange={(e) => {
//                     field.onChange(e);  // Chama o onChange original do field
//                     updateField('porcaoAlmoco1', e);  // Chama a função que actualiza o estado
//                   }} >
//                   <FormControl>
//                     <SelectTrigger className="w-full text-[13px]">
//                       <SelectValue placeholder="..." className="text-[13px]" {...field} />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem className="text-[13px]" value="Inteira">Inteira</SelectItem>
//                     <SelectItem className="text-[13px]" value="Meia">Meia</SelectItem>
//                     <SelectItem className="text-[13px]" value="Menos">Menos</SelectItem>
//                     <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
//                   </SelectContent>
//                 </Select>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//           </div>

          
//           <div className="flex justify-between gap-4">
//             <FormField
//               control={form.control}
//               name="almoco2"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   {/* <FormLabel className="text-muted-foreground text-[13px]">Almoço: 2º</FormLabel> */}
//                   <FormControl>
//                     <Input placeholder="Almoço: 2º" className="text-[13px]" {...field}
//                     defaultValue={state.almoco2}
//                     // value={state.almoco2}
//                     onChange={(e) => {
//                       field.onChange(e);  // Chama o onChange original do field
//                       updateField('almoco2', e.target.value);  // Chama a função que actualiza o estado
//                     }} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//               <FormField
//               control={form.control}
//               name="porcaoAlmoco2"
//               render={({ field }) => (
//                 <FormItem className="min-w-[140px]">
//                   {/* <FormLabel className="text-muted-foreground text-[13px]">Porção</FormLabel> */}
//                   <Select
//                    defaultValue={state.porcaoAlmoco2}
//                    onValueChange={(e) => {
//                     field.onChange(e);  // Chama o onChange original do field
//                     updateField('porcaoAlmoco2', e);  // Chama a função que actualiza o estado
//                   }} >
//                   <FormControl>
//                     <SelectTrigger className="w-full text-[13px]">
//                       <SelectValue placeholder="..." className="text-[13px]" {...field} />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem className="text-[13px]" value="Inteira">Inteira</SelectItem>
//                     <SelectItem className="text-[13px]" value="Meia">Meia</SelectItem>
//                     <SelectItem className="text-[13px]" value="Menos">Menos</SelectItem>
//                     <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
//                   </SelectContent>
//                 </Select>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//           </div>

          
//           <div className="flex justify-between gap-4">
//           <FormField
//               control={form.control}
//               name="sobremesa"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   {/* <FormLabel className="text-muted-foreground text-[13px]">Sobremesa</FormLabel> */}
//                   <FormControl>
//                     <Input placeholder="Sobremesa" className="text-[13px]" {...field}
//                     defaultValue={state.sobremesa}
//                     // value={state.sobremesa}
//                     onChange={(e) => {
//                       field.onChange(e);  // Chama o onChange original do field
//                       updateField('sobremesa', e.target.value);  // Chama a função que actualiza o estado
//                     }} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//               <FormField
//               control={form.control}
//               name="porcaoSobremesa"
//               render={({ field }) => (
//                 <FormItem className="min-w-[140px]">
//                   {/* <FormLabel className="text-muted-foreground text-[13px]">Porção</FormLabel> */}
//                   <Select
//                    defaultValue={state.porcaoSobremesa}
//                    onValueChange={(e) => {
//                     field.onChange(e);  // Chama o onChange original do field
//                     updateField('porcaoSobremesa', e);  // Chama a função que actualiza o estado
//                   }} >
//                   <FormControl>
//                     <SelectTrigger className="w-full text-[13px]">
//                       <SelectValue placeholder="..." className="text-[13px]" {...field} />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem className="text-[13px]" value="Inteira">Inteira</SelectItem>
//                     <SelectItem className="text-[13px]" value="Meia">Meia</SelectItem>
//                     <SelectItem className="text-[13px]" value="Menos">Menos</SelectItem>
//                     <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
//                   </SelectContent>
//                 </Select>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//           </div>

//           <div className="flex justify-between gap-4">
//             <FormField
//               control={form.control}
//               name="lanche"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   {/* <FormLabel className="text-muted-foreground text-[13px]">Lanche</FormLabel> */}
//                   <FormControl>
//                     <Input placeholder="Lanche" className="text-[13px]" {...field}
//                     defaultValue={state.lanche}
//                     // value={state.lanche}
//                     onChange={(e) => {
//                       field.onChange(e);  // Chama o onChange original do field
//                       updateField('lanche', e.target.value);  // Chama a função que actualiza o estado
//                     }} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//               <FormField
//               control={form.control}
//               name="porcaoLanche"
//               render={({ field }) => (
//                 <FormItem className="min-w-[140px]">
//                   {/* <FormLabel className="text-muted-foreground text-[13px]">Porção</FormLabel> */}
//                   <Select
//                    defaultValue={state.porcaoLanche}
//                    onValueChange={(e) => {
//                     field.onChange(e);  // Chama o onChange original do field
//                     updateField('porcaoLanche', e);  // Chama a função que actualiza o estado
//                   }} >
//                   <FormControl>
//                     <SelectTrigger className="w-full text-[13px]">
//                       <SelectValue placeholder="..." className="text-[13px]" {...field} />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem className="text-[13px]" value="Inteira">Inteira</SelectItem>
//                     <SelectItem className="text-[13px]" value="Meia">Meia</SelectItem>
//                     <SelectItem className="text-[13px]" value="Menos">Menos</SelectItem>
//                     <SelectItem className="text-[13px]" value="Não comeu">Não comeu</SelectItem>
//                   </SelectContent>
//                 </Select>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//           </div>

//           <CardTitle className="text-left text-[13px] mt-3 md:mt-1">Outras ocorrências</CardTitle>
//           <div className="flex justify-between gap-4">
//             <FormField
//               control={form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   {/* <FormLabel className="text-muted-foreground text-[13px]">Porção</FormLabel> */}
//                   <FormControl>
//               <Textarea
//                 placeholder="Deixe a sua mensagem"
//                 className="resize-none text-[13px]"
//                 {...field}
//                 defaultValue={state.description}
//                 // value={state.description}
//                     onChange={(e) => {
//                       field.onChange(e);  // Chama o onChange original do field
//                       updateField('description', e.target.value);  // Chama a função que actualiza o estado
//                     }}
//               />
//             </FormControl>
//             {/* <FormDescription>
//               You can <span>@mention</span> other users and organizations.
//             </FormDescription> */}
//                   <FormMessage />
//                 </FormItem>
//               )} />
//           </div>
//           </div>

//           <div className="flex items-center justify-between gap-2 w-full">
//           <div className="w-full border-zinc-200 h-full">
//               <FormField
//               control={form.control}
//               name="fezes"
//               render={({ field }) => (
//                 <FormItem className="min-w-[140px]">
//                   <CardTitle className="text-left text-[13px]">Fezes</CardTitle>
//                   <Select
//                   defaultValue={state.fezes}
//                    onValueChange={(e) => {
//                     field.onChange(e);  // Chama o onChange original do field
//                     updateField('fezes', e);  // Chama a função que actualiza o estado
//                   }} required>
//                   <FormControl>
//                     <SelectTrigger className="w-full text-[13px]">
//                       <SelectValue placeholder="..." className="text-[13px]" {...field} />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem className="text-[13px]" value="Normal">Normal</SelectItem>
//                     <SelectItem className="text-[13px]" value="Diarreia">Diarreia</SelectItem>
//                     <SelectItem className="text-[13px]" value="Não evacuou">Não evacuou</SelectItem>
//                   </SelectContent>
//                 </Select>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//           </div>
//           <div className="w-full border-zinc-200 h-full">
//               <FormField
//               control={form.control}
//               name="vomitos"
//               render={({ field }) => (
//                 <FormItem className="min-w-[140px]">
//                   <CardTitle className="text-left text-[13px]">Vômitos</CardTitle>
//                   <Select
//                   defaultValue={state.vomitos}
//                    onValueChange={(e) => {
//                     field.onChange(e);  // Chama o onChange original do field
//                     updateField('vomitos', e);  // Chama a função que actualiza o estado
//                   }} required>
//                   <FormControl>
//                     <SelectTrigger className="w-full text-[13px]">
//                       <SelectValue placeholder="..." className="text-[13px]" {...field} />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem className="text-[13px]" value="Sim">Sim</SelectItem>
//                     <SelectItem className="text-[13px]" value="Não">Não</SelectItem>
//                   </SelectContent>
//                 </Select>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//           </div>
//           <div className="w-full border-zinc-200 h-full">
//               <FormField
//               control={form.control}
//               name="febres"
//               render={({ field }) => (
//                 <FormItem className="min-w-[140px]">
//                   <CardTitle className="text-left text-[13px]">Febres</CardTitle>
//                   <Select
//                   defaultValue={state.febres}
//                    onValueChange={(e) => {
//                     field.onChange(e);  // Chama o onChange original do field
//                     updateField('febres', e);  // Chama a função que actualiza o estado
//                   }} required>
//                   <FormControl>
//                     <SelectTrigger className="w-full text-[13px]">
//                       <SelectValue placeholder="..." className="text-[13px]" {...field} />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem className="text-[13px]" value="Sim">Sim</SelectItem>
//                     <SelectItem className="text-[13px]" value="Não">Não</SelectItem>
//                   </SelectContent>
//                 </Select>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//           </div>
//           </div>
//           </div>

//           <div className="flex justify-end items-center gap-4 mt-5">
//             <Button type="button" onClick={() => downloadPDF()} disabled={isLoading} variant="secondary" className="w-full md:w-fit flex items-center text-[12px]">
//               {isLoading ? (
//                 <i className="ri-loader-line animate-spin text-[14px]"></i>
//               )
//               : (
//                 <>
//                   <i className="ri-download-line mr-2 text-[14px]"></i>
//                   Baixar
//                 </>
//               )}
//             </Button>
//             <Button type="submit" disabled={isSendingEmail} className="w-full md:w-fit flex items-center text-[12px]">
//             {isSendingEmail ? (
//                 <i className="ri-loader-line animate-spin text-[14px]"></i>
//               )
//               : (
//                 <>
//                   <i className="ri-mail-send-line mr-2 text-[14px]"></i>
//                   Enviar
//                 </>
//               )}
//             </Button>
//           </div>
//         </form>
//       </Form>
//                     ) : <p>Ninguém foi seleccionado</p>
//                 }
//         </div>
//     )
// }


// "use client"

// import { getStudents } from '@/lib/api';
// import React, { useState } from 'react'
// import {
//     Table,
//     TableBody,
//     TableCaption,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table"

// import {
//     Dialog,
//     DialogTrigger,
// } from "@/components/ui/dialog"

// import Report from "@/components/report";
// import { Button } from "@/components/ui/button";
// import DeleteAction from "@/components/delete-action";
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"

// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormMessage,
// } from "@/components/ui/form"

// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import { CardTitle } from "./ui/card"
// import { useMediaQuery } from "@react-hook/media-query"
// import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerTrigger } from './ui/drawer';



// const formSchema = z.object({
//     turma: z.string().min(2).max(2),
// })

// // Definindo uma interface para o tipo dos dados
// interface IDataItem {
//     id: string;
//     created_at: string;
//     name: string;
//     year: number;
//     class: string;
//     email: string;
//     parent: string;
// }

// interface IGetStudents {
//     permLevel: string
// }

// const GetStudent = (props: IGetStudents) => {

//     // const [dados, setData] = useState([]);
//     const [loading, setLoading] = useState<boolean>(false);
//     const isDesktop = useMediaQuery("(min-width: 768px)")

//     const [students, setStudents] = useState<IDataItem[]>([])
//     const [state, setState] = useState({
//         turma: ""
//     })

//     // Função para adicionar um novo aluno
//     const newStudent = async (newStudentData: any) => {
//         try {
//             setLoading(true);
//             setStudents((prevStudents) => [...prevStudents, newStudentData]);
//         } catch (error) {
//             console.error('Error adding student:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // const dataHandler = async (values: []) => {}

//     //   useEffect(() => {
//     //     const getData = async () => {
//     //         setLoading(true);
//     //       try {
//     //         const response = await getStudents();
//     //         const responseData = await response.data;
//     //         setData(responseData);

//     //         console.log(response.data)
//     //       } catch (error) {
//     //         console.error('Error fetching data:', error);
//     //       } finally {
//     //         setLoading(false);
//     //       }
//     //     };

//     //     getData();
//     //   }, []);

//     // Modificando um dos estados
//     const updateField = (field: any, value: any) => {
//         setState((prevState) => ({
//             ...prevState,
//             [field]: value,
//         }));
//     };


//     // 1. Define form.
//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             turma: "",
//         },
//     })

//     async function dataHandler(values: any) {

//         // Armazena os dados em um estado para renderizar
//         setStudents(values)
//         JSON.stringify(students, null, 2);
//     }
//     // 2. Define a submit handler.
//     async function onSubmit(values: z.infer<typeof formSchema>) {
//         try {
//             setLoading(true);
//             const response = await getStudents(values);
//             const { data } = await response?.json();
//             await dataHandler(data)

//         } catch (error) {
//             console.error('Error fetching data:', error);
//         } finally {
//             setLoading(false);
//         }
//     }


//     return (
//         <React.Fragment>
//             <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 flex items-end gap-4">
//                     <div className='w-full md:w-auto'>
//                         <FormField
//                             control={form.control}
//                             name="turma"
//                             render={({ field }) => (
//                                 <FormItem className="md:min-w-[140px]">
//                                     <CardTitle className="text-[16px] mt-3">Filtro</CardTitle>
//                                     <Select
//                                         //  defaultValue={field.value}
//                                         onValueChange={(e) => {
//                                             field.onChange(e);  // Chama o onChange original do field
//                                             updateField('turma', e);  // Chama a função que actualiza o estado
//                                         }} >
//                                         <FormControl>
//                                             <SelectTrigger className="w-full text-[13px]">
//                                                 <SelectValue placeholder="" {...field} />
//                                             </SelectTrigger>
//                                         </FormControl>
//                                         <SelectContent>
//                                             <SelectItem className="text-[13px]" value="T1">T1</SelectItem>
//                                             <SelectItem className="text-[13px]" value="T2">T2</SelectItem>
//                                             <SelectItem className="text-[13px]" value="T3">T3</SelectItem>
//                                             <SelectItem className="text-[13px]" value="T4">T4</SelectItem>
//                                             <SelectItem className="text-[13px]" value="T5">T5</SelectItem>
//                                             <SelectItem className="text-[13px]" value="T6">T6</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                     <FormMessage />
//                                 </FormItem>
//                             )} />
//                     </div>

//                     <Button type="submit" className="text-[12px]">
//                         <i className="ri-equalizer-2-line mr-2"></i>
//                         Filtrar
//                     </Button>
//                 </form>
//             </Form>


//             {loading ?
//                 <div className='w-full h-full flex justify-center items-center pt-10 mt-10'><i className="ri-loader-line animate-spin text-[16px]"></i></div>
//                 :
//                 students.length > 0
//                     ? (
//                         <Table className="mt-5 rounded-sm text-[13px]">
//                             {/* <TableCaption>Lista dos alunos da turma {state.turma}.</TableCaption> */}
//                             <TableHeader className="bg-zinc-200/50 border border-zinc-200">
//                                 <TableRow>
//                                     <TableHead className="w-[140px] font-bold">Código</TableHead>
//                                     <TableHead className="font-bold">Nome</TableHead>
//                                     {/* <TableHead className="font-bold">Ano</TableHead> */}
//                                     {/* <TableHead className="font-bold">Turma</TableHead> */}
//                                     <TableHead className="font-bold">Parente</TableHead>
//                                     <TableHead className="font-bold">E-mail</TableHead>
//                                     {props.permLevel === 'admin' ? <TableHead className="w-[60px] font-bold">Ação</TableHead> : ''}
//                                 </TableRow>
//                             </TableHeader>

//                             <TableBody className="border border-zinc-200">
//                                 {students.map((aluno: any, index: any) => (
//                                     <TableRow key={index}>
//                                         <TableCell className="max-w-[140px] font-medium text-nowrap overflow-hidden text-ellipsis">{aluno.id}</TableCell>
//                                         <TableCell>

//                                             {isDesktop
//                                                 ?
//                                                 (
//                                                     <Dialog>
//                                                     <DialogTrigger className="hover:cursor-pointer hover:text-blue-500 hover:underline">
//                                                         {aluno.name}
//                                                     </DialogTrigger>

//                                                     <Report
//                                                         id={aluno.id}
//                                                         name={aluno.name}
//                                                         year={aluno.year}
//                                                         class={aluno.class}
//                                                         email={aluno.email} />
//                                                 </Dialog>
//                                                 )
//                                                 :
//                                                 (
//                                                     <Drawer>
//                                                     <DrawerTrigger asChild className="hover:cursor-pointer hover:text-blue-500 hover:underline">
//                                                         <Button
//                                                             variant="link"
//                                                             className="text-[13px]"
//                                                         >
//                                                             {aluno.name}
//                                                         </Button>
//                                                     </DrawerTrigger>
//                                                     <Report
//                                                         id={aluno.id}
//                                                         name={aluno.name}
//                                                         year={aluno.year}
//                                                         class={aluno.class}
//                                                         email={aluno.email} />
//                                                 </Drawer>
//                                                 )
//                                             }

//                                         </TableCell>
//                                         {/* <TableCell>{aluno.year}</TableCell> */}
//                                         {/* <TableCell>{aluno.class}</TableCell> */}
//                                         <TableCell>{aluno.parent}</TableCell>
//                                         <TableCell>{aluno.email}</TableCell>
//                                         {props.permLevel === 'admin' ?
//                                             <TableCell className="flex items-center gap-6 pr-4">
//                                                 <DeleteAction id={aluno.id} name={aluno.name} class={aluno.class} />
//                                             </TableCell>
//                                             : ""
//                                         }
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     )
//                     :
//                     (
//                         <div className='w-full h-full flex flex-col justify-center items-center pt-10 mt-10'>
//                             <i className="ri-inbox-2-line text-[40px] text-muted-foreground"></i>
//                             <span className='text-[14px] text-muted-foreground'>Não existem alunos nesta turma.</span>
//                         </div>
//                     )}
//         </React.Fragment>
//     )
// }

// export default GetStudent