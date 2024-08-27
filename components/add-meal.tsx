"use client"

import React, { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Form, FormField, FormItem, FormControl, FormMessage } from "./ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { CardTitle } from "./ui/card"
import { addMeal } from "@/lib/api"


const formSchema = z.object({
    pequenoAlmoco: z.string().optional(),
    almoco1: z.string().optional(),
    almoco2: z.string().optional(),
    sobremesa: z.string().optional(),
    lanche: z.string().optional(),
    extras1: z.string().optional(),
    extras2: z.string().optional(),
})

export function AddMeal() {

    const [isSubmitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)

    const loadHandler = (state: boolean) => {
        setLoading(!state)
    }

    const sendingHandler = (state: boolean) => {
        setSubmitting(!state)
        setTimeout(() => {
            toast('Sucesso', {
                description: 'A refeição do dia foi adicionada.',
                duration: 12000,
                cancel: {
                    label: 'Fechar',
                    onClick: () => console.log('Cancel!'),
                },
            })
            setSubmitting(state)
        }, 2000);
    }

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            pequenoAlmoco: "",
            almoco1: "",
            almoco2: "",
            sobremesa: "",
            lanche: "",
            extras1: "",
            extras2: "",
        },
    })


    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {

        console.log(values)
        
        try {
              sendingHandler(loading);
              await addMeal(values);
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    className="hidden sm:flex items-center text-[14px]"
                >
                    <i className="ri-restaurant-line mr-2 text-[15px]"></i>
                    {/* <i className="ri-add-line text-[14px] font-thin"></i> */}
                    Refeição
                </Button>
            </SheetTrigger>
            <SheetContent className="min-w-full md:min-w-[600px]">
                <SheetHeader>
                    <SheetTitle>Refeição do dia</SheetTitle>
                    <SheetDescription>
                        Adicione a refeição do dia aqui. Clique em &#34;Guardar&#34; assim que terminar.
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="h-auto">
                        <div className="grid gap-7 grid-cols-4 mt-5">
                            <div className="col-span-4 gap-4">
                                <div className="flex flex-col gap-3">
                                    <CardTitle className="text-left text-[13px]">Pequeno-almoço</CardTitle>
                                    <div className="flex justify-between gap-4">
                                        <FormField
                                            control={form.control}
                                            name="pequenoAlmoco"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    {/* <FormLabel className="text-muted-foreground text-[13px]">Pequeno-almoço</FormLabel> */}
                                                    <FormControl>
                                                        <Input placeholder="Pequeno-almoço" {...field} className="text-[13px]" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                    </div>

                                    <CardTitle className="text-left text-[13px]">Refeição extra da manhã</CardTitle>
                                    <div className="flex justify-between gap-4">
                                        <FormField
                                            control={form.control}
                                            name="extras1"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormControl>
                                                        <Input placeholder="Refeição extra da manhã" {...field} className="text-[13px]" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                    </div>

                                    <CardTitle className="text-left text-[13px]">Almoço</CardTitle>
                                    <div className="flex justify-between gap-4">
                                        <FormField
                                            control={form.control}
                                            name="almoco1"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormControl>
                                                        <Input placeholder="1º Almoço" className="text-[13px]" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        <FormField
                                            control={form.control}
                                            name="almoco2"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormControl>
                                                        <Input placeholder="2º Almoço" className="text-[13px]" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                    </div>

                                    <CardTitle className="text-left text-[13px]">Sobremesa & Lanche</CardTitle>
                                    <div className="flex justify-between gap-4">
                                        <FormField
                                            control={form.control}
                                            name="sobremesa"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormControl>
                                                        <Input placeholder="Sobremesa" className="text-[13px]" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        <FormField
                                            control={form.control}
                                            name="lanche"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormControl>
                                                        <Input placeholder="Lanche" className="text-[13px]" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                    </div>

                                    <CardTitle className="text-left text-[13px]">Refeição extra da tarde</CardTitle>
                                    <div className="flex justify-between gap-4">
                                        <FormField
                                            control={form.control}
                                            name="extras2"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormControl>
                                                        <Input placeholder="Refeição extra da tarde" {...field} className="text-[13px]" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                    </div>
                                </div>
                            </div>
                        </div>
                <SheetFooter className="mt-4">
                    <SheetClose asChild>
                        <Button type="submit">Guardar</Button>
                    </SheetClose>
                </SheetFooter>
                </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}