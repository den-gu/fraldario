"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  Dialog,
  DialogContent,
  DialogDescription,
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

interface IReport {
  id: string;
  name: string;
  year: number;
  class: string;
  email: string;
}

const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().min(2).max(50),
  behavior: z.string().min(2).max(50),
  pequenoAlmoco: z.string().min(2).max(50),
  almoco1: z.string().min(2).max(50),
  almoco2: z.string().min(2).max(50),
  sobremesa: z.string().min(2).max(50),
  lanche: z.string().min(2).max(50),
  porcaoPequenoAlmoco: z.string().min(2).max(50),
  porcaoAlmoco1: z.string().min(2).max(50),
  porcaoAlmoco2: z.string().min(2).max(50),
  porcaoSobremesa: z.string().min(2).max(50),
  porcaoLanche: z.string().min(2).max(50),
  fezes: z.string().min(2).max(50),
  vomitos: z.string().min(2).max(50),
  febres: z.string().min(2).max(50),
  description: z.string().min(2).max(50),
})

export default function Report(data: IReport) {

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
      pequenoAlmoco: "",
      almoco1: "",
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
    // Or use javascript directly:
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
    }, 2000);
  }

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {

    try {
      await sendReport(values);
      sendingHandler(isSendingEmail);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <DialogContent className="w-full min-w-[650px] px-0 pt-4">
      <DialogHeader>
        <DialogTitle className="border-b border-zinc-200 px-6 pb-3">O Fraldario</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-col h-full gap-6 px-6">
            <div className="flex items-start gap-5">
            <div className="flex flex-col w-full gap-2 pt-2 h-full">
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                  <CardTitle className="text-[13px] mt-3">Nome da criança</CardTitle>
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
                    <CardTitle className="text-[13px] mt-3">Comportamento</CardTitle>
                    <Select
                    //  defaultValue={field.value}
                     onValueChange={(e) => {
                      field.onChange(e);  // Chama o onChange original do field
                      updateField('behavior', e);  // Chama a função que actualiza o estado
                    }} >
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

            <CardTitle className="text-[13px] mt-3">Refeição/Porção</CardTitle>
            <div className="flex justify-between gap-4">
              <FormField
                control={form.control}
                name="pequenoAlmoco"
                render={({ field }) => (
                  <FormItem className="w-full">
                    {/* <FormLabel className="text-muted-foreground text-[13px]">Pequeno-almoço</FormLabel> */}
                    <FormControl>
                      <Input placeholder="Pequeno-almoço" className="text-[13px]" {...field}
                      value={state.pequenoAlmoco}
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
                    //  defaultValue={field.value}
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
                      value={state.almoco1}
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
                    //  defaultValue={field.value}
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
                      value={state.almoco2}
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
                    //  defaultValue={field.value}
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
                      value={state.sobremesa}
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
                    //  defaultValue={field.value}
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
                      value={state.lanche}
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
                    //  defaultValue={field.value}
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

            <CardTitle className="text-[13px] mt-3">Outras ocorrências</CardTitle>
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
                  value={state.description}
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

            <div className="flex-col">
            <div className="border-zinc-200 h-full pl-4 pt-2">
                <FormField
                control={form.control}
                name="fezes"
                render={({ field }) => (
                  <FormItem className="min-w-[140px]">
                    <CardTitle className="text-[13px] mt-3">Fezes</CardTitle>
                    <Select
                     onValueChange={(e) => {
                      field.onChange(e);  // Chama o onChange original do field
                      updateField('fezes', e);  // Chama a função que actualiza o estado
                    }} >
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
            <div className="border-zinc-200 h-full pl-4 pt-3">
                <FormField
                control={form.control}
                name="vomitos"
                render={({ field }) => (
                  <FormItem className="min-w-[140px]">
                    <CardTitle className="text-[13px] mt-3">Vômitos</CardTitle>
                    <Select
                     onValueChange={(e) => {
                      field.onChange(e);  // Chama o onChange original do field
                      updateField('vomitos', e);  // Chama a função que actualiza o estado
                    }} >
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
            <div className="border-zinc-200 h-full pl-4 pt-3">
                <FormField
                control={form.control}
                name="febres"
                render={({ field }) => (
                  <FormItem className="min-w-[140px]">
                    <CardTitle className="text-[13px] mt-3">Febres</CardTitle>
                    <Select
                     onValueChange={(e) => {
                      field.onChange(e);  // Chama o onChange original do field
                      updateField('febres', e);  // Chama a função que actualiza o estado
                    }} >
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
              <Button type="button" onClick={() => downloadPDF()} disabled={isLoading} variant="secondary" className="flex items-center text-[12px]">
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
              <Button type="submit" disabled={isSendingEmail} className="flex items-center text-[12px]">
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
        {/* <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
            </DialogDescription> */}
      </DialogHeader>
    </DialogContent>
  )
}