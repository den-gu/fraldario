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

import React from 'react'
import { Button } from "./ui/button"
import { jsPDF } from "jspdf"
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 flex flex-col gap-4">
        <div className="flex justify-between mt-4 hidden">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Nome</FormLabel>
              <FormControl>
                <Input defaultValue={data.name} placeholder={data.name} disabled {...field} className="disabled:placeholder:text-[#000000]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">E-mail</FormLabel>
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
              <FormLabel className="text-muted-foreground">Pequeno-almoço</FormLabel>
              <FormControl>
                <Input placeholder="..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField
          control={form.control}
          name="almoco"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Almoço</FormLabel>
              <FormControl>
                <Input placeholder="..." {...field} />
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
              <FormLabel className="text-muted-foreground">Sobremesa</FormLabel>
              <FormControl>
                <Input placeholder="..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField
          control={form.control}
          name="lanche"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Lanche</FormLabel>
              <FormControl>
                <Input placeholder="..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          </div>

          <Button type="submit" className="flex items-center self-end">
        <i className="ri-mail-send-line mr-2"></i>
            Enviar
        </Button>
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