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

  const [isLoading, setloading] = useState(false)

  const loadHandler = (loading: boolean) => {
    setloading(!loading)
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

    // setTimeout(() => {      
    //   loadHandler(isLoading)
    // }, 3000);

    setTimeout(() => {
      loadHandler(!isLoading);
      // Save the PDF
      doc.save(`Relatorio-${createdAt}-${state.name}.pdf`);
    }, 3000);

    // console.log(doc);
  }
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {

    try {
      await sendReport(values);
      // setTouched({});
      // setState(initState);
      // toast({
      //   title: "Message sent.",
      //   status: "success",
      //   duration: 2000,
      //   position: "top",
      // });
    } catch (error) {
      // setState((prev) => ({
      //   ...prev,
      //   isLoading: false,
      //   error: error.message,
      // }));
      console.log(error)
    }
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // const createdAt = new Date().getDate();
    // const doc = new jsPDF();

    // console.log(createdAt)

    // doc.text(`Nome: ${values.name}`, 10, 10);
    // doc.text(`Email: ${values.email}`, 10, 20);
    // doc.text(`Comportamento: ${values.email}`, 10, 20);
    // doc.text(`Pequeno-almoço: ${values.almoco}`, 10, 30);
    // doc.text(`Almoço: ${values.almoco}`, 10, 30);
    // doc.text(`Sobremesa: ${values.almoco}`, 10, 30);
    // doc.text(`Lanche: ${values.almoco}`, 10, 30);

    // doc.save(`relatorio-${createdAt}.pdf`);
    // console.log(values)  
    // const formData = new FormData(formSchema)
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
                      onChange={(e) => updateField('pequenoAlmoco', e.target.value)} />
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
                      onChange={(e) => updateField('almoco', e.target.value)} />
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
                      onChange={(e) => updateField('sobremesa', e.target.value)} />
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
                      onChange={(e) => updateField('lanche', e.target.value)} />
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
              <Button type="submit" className="flex items-center text-[12px]">
                <i className="ri-mail-send-line mr-2 text-[14px]"></i>
                Enviar
              </Button>
            </div>
          </form>
        </Form>
        {/* {data.id}
            {data.name}
            {data.year}
            {data.class}
            {data.email} */}
        {/* <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
            </DialogDescription> */}
      </DialogHeader>
    </DialogContent>
  )
}