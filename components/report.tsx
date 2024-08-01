"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import React, { useState } from 'react'
import { Button } from "./ui/button"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { sendReport } from "@/lib/api"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { CardTitle } from "./ui/card"
import { toast } from 'sonner';
import { useMediaQuery } from "@react-hook/media-query"
import { DrawerTrigger, DrawerContent, DrawerFooter, DrawerClose } from "./ui/drawer"

interface IReport {
  id: string;
  name: string;
  year: number;
  class: string;
  email: string;
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

export default function Report(data: IReport) {

  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
      return (
          <DialogContent className="w-full lg:min-w-[650px] px-0 pt-3">
            <DialogHeader>
              <DialogTitle className="border-b border-zinc-200 px-6 pb-3">O Fraldario</DialogTitle>
            </DialogHeader>
            <StudentData id={data.id} name={data.name} class={data.class} year={data.year} email={data.email} />
          </DialogContent>
      )
    } else {
      return (
        <DrawerContent className="px-5">
            <StudentData id={data.id} name={data.name} class={data.class} year={data.year} email={data.email} />
          {/* <DrawerFooter className="px-0">
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter> */}
        </DrawerContent>
    )
    }
}

function StudentData(data: IReport, { className }: React.ComponentProps<"form">) {

  const [isSubmitting, setSubmitting] = useState(false)

  // Declarando múltiplos estados como propriedades de um objeto
  const [state, setState] = useState({
    name: data.name,
    email: data.email,
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

  const [isLoading, setLoading] = useState(false)
  const [isSendingEmail, setSending] = useState(false)
  

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
      name: data.name,
      email: data.email,
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

    loadHandler(isLoading);

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
      sendingHandler(isSendingEmail);
      await sendReport(values);
    } catch (error) {
      console.log(error)
    }
  }

  
    return (
      <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-col h-auto gap-6 px-6 pb-3">
              <div className="flex flex-col items-start gap-2 lg:gap-5">
              <div className="flex flex-col w-full gap-2 pt-2 h-full">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                    <CardTitle className="text-left text-[13px] mt-3">Nome da criança</CardTitle>
                      <FormControl>
                        <Input defaultValue={data.name} placeholder={data.name} disabled {...field}
                        className="disabled:placeholder:text-[#000000]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                <FormField
                  control={form.control}
                  name="behavior"
                  render={({ field }) => (
                    <FormItem className="min-w-[140px]">
                      <CardTitle className="text-left text-[13px] mt-3">Comportamento</CardTitle>
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
  
              <CardTitle className="text-left text-[13px] mt-3 md:mt-1">Refeição/Porção</CardTitle>
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
                      </SelectContent>
                    </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
              </div>
  
              <CardTitle className="text-left text-[13px] mt-3 md:mt-1">Outras ocorrências</CardTitle>
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
  
              <div className="flex items-center justify-between gap-2 w-full">
              <div className="w-full border-zinc-200 h-full">
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
              <div className="w-full border-zinc-200 h-full">
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
              <div className="w-full border-zinc-200 h-full">
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
  
              <div className="flex justify-end items-center gap-4 mt-5">
                <Button type="button" onClick={() => downloadPDF()} disabled={isLoading} variant="secondary" className="w-full md:w-fit flex items-center text-[12px]">
                  {isLoading ? (
                    <i className="ri-loader-line animate-spin text-[14px]"></i>
                  )
                  : (
                    <>
                      <i className="ri-download-line mr-2 text-[14px]"></i>
                      Baixar
                    </>
                  )}
                </Button>
                <Button type="submit" disabled={isSendingEmail} className="w-full md:w-fit flex items-center text-[12px]">
                {isSendingEmail ? (
                    <i className="ri-loader-line animate-spin text-[14px]"></i>
                  )
                  : (
                    <>
                      <i className="ri-mail-send-line mr-2 text-[14px]"></i>
                      Enviar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
    )
}