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
  pequenoAlmoco: z.string().min(2).max(50),
  almoco: z.string().min(2).max(50),
  sobremesa: z.string().min(2).max(50),
  lanche: z.string().min(2).max(50),
})

export default function Report(data: IReport) {

  // Declarando múltiplos estados como propriedades de um objeto
  const [state, setState] = useState({
    name: data.name,
    email: data.email,
    pequenoAlmoco: "",
    almoco: "",
    sobremesa: "",
    lanche: "",
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
      almoco: "",
      sobremesa: "",
      lanche: "",
    },
  })

  const downloadPDF = () => {

    loadHandler(isLoading);

    const doc = new jsPDF('l');
    const date = new Date();
    const createdAt = new Intl.DateTimeFormat('pt-BR').format(date);
    
    doc.setFontSize(10);
    doc.text(`O Fraldario - Data: ${createdAt}`, 14, 30);
    // Generate the table
    // Or use javascript directly:
    autoTable(doc, {
      head: [["Nome", "Pequeno-almoço", "Almoço", "Sobremesa", "Lanche"]],
      theme: 'striped',
      margin: { top: 34 },
      body: [
        [`${state.name}`, `${state.pequenoAlmoco}`, `${state.almoco}`, `${state.sobremesa}`, `${state.lanche}`],
      ],
    })

    doc.text(`Fezes: -    Vômitos: -    Febres: -    Comportamento: Bom`, 14, 55);
    doc.text(`Outras ocorrências: -`, 14, 60);

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
    <DialogContent>
      <DialogHeader>
        <DialogTitle>O Fraldario</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 flex flex-col gap-2">
            <div className="flex justify-between mt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-[13px]">Nome</FormLabel>
                    <FormControl>
                      <Input defaultValue={data.name} placeholder={data.name} disabled {...field}
                      className="disabled:placeholder:text-[#000000]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-[13px]">E-mail</FormLabel>
                    <FormControl>
                      <Input defaultValue={data.email} placeholder={data.email} disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
            </div>
            <div className="flex justify-between">
              <FormField
                control={form.control}
                name="pequenoAlmoco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-[13px]">Pequeno-almoço</FormLabel>
                    <FormControl>
                      <Input placeholder="..." {...field}
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
                name="almoco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-[13px]">Almoço</FormLabel>
                    <FormControl>
                      <Input placeholder="..." {...field}
                      value={state.almoco}
                      onChange={(e) => {
                        field.onChange(e);  // Chama o onChange original do field
                        updateField('almoco', e.target.value);  // Chama a função que actualiza o estado
                      }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
            </div>

            <div className="flex justify-between">
              <FormField
                control={form.control}
                name="sobremesa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-[13px]">Sobremesa</FormLabel>
                    <FormControl>
                      <Input placeholder="..." {...field}
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
                name="lanche"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-[13px]">Lanche</FormLabel>
                    <FormControl>
                      <Input placeholder="..." {...field}
                      value={state.lanche}
                      onChange={(e) => {
                        field.onChange(e);  // Chama o onChange original do field
                        updateField('lanche', e.target.value);  // Chama a função que actualiza o estado
                      }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
            </div>

            <div className="flex justify-end items-center gap-4 mt-2">
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