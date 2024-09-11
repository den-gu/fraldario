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
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "./ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { CardTitle } from "./ui/card"
import { addMeal } from "@/lib/api"


const formSchema = z.object({
    pequeno_almoco: z.string().optional(),
    pequeno_almoco_extra1: z.string().optional(),
    pequeno_almoco_extra2: z.string().optional(),
    almoco1: z.string().optional(),
    almoco1_extra1: z.string().optional(),
    almoco1_extra2: z.string().optional(),
    almoco2: z.string().optional(),
    almoco2_extra1: z.string().optional(),
    almoco2_extra2: z.string().optional(),
    sobremesa: z.string().optional(),
    sobremesa_extra1: z.string().optional(),
    sobremesa_extra2: z.string().optional(),
    lanche: z.string().optional(),
    lanche_extra1: z.string().optional(),
    lanche_extra2: z.string().optional(),
    extras1: z.string().optional(),
    extras2: z.string().optional(),
})

export function AddMeal() {

    const [isSubmitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)

    let [pCounter, setPCounter] = useState(0)
    let [am1Counter, setAm1Counter] = useState(0)
    let [am2Counter, setAm2Counter] = useState(0)
    let [sbCounter, setSbCounter] = useState(0)
    let [lnCounter, setLnCounter] = useState(0)

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
            pequeno_almoco: "",
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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="h-auto">
                <div className="grid gap-7 grid-cols-4">
                    <div className="col-span-4 gap-4">
                        <div className="flex flex-col gap-2">

                            <FormLabel className="text-[12px]">Pequeno-almoço</FormLabel>
                            <div className="flex flex-col gap-2">
                                <FormField
                                    control={form.control}
                                    name="pequeno_almoco"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            {/* <FormLabel className="text-muted-foreground text-[13px]">Pequeno-almoço</FormLabel> */}
                                            <FormControl>
                                                <Input placeholder="Pequeno-almoço" {...field} className="text-[13px]" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                {pCounter >= 1 ?
                                    <FormField
                                        control={form.control}
                                        name="pequeno_almoco_extra1"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                {/* <FormLabel className="text-muted-foreground text-[13px]">Pequeno-almoço</FormLabel> */}
                                                <FormControl>
                                                    <Input placeholder="Pequeno-almoço" {...field} className="text-[13px]" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} /> : ''}

                                {pCounter >= 2 ?
                                    <FormField
                                        control={form.control}
                                        name="pequeno_almoco_extra2"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                {/* <FormLabel className="text-muted-foreground text-[13px]">Pequeno-almoço</FormLabel> */}
                                                <FormControl>
                                                    <Input placeholder="Pequeno-almoço" {...field} className="text-[13px]" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} /> : ''}

                                <Button variant="link" type="button" onClick={() => setPCounter(++pCounter)} className="w-fit text-blue-400 hover:no-underline p-0 h-auto text-[11px] mt-0 mb-2">
                                    <i className="ri-add-line"></i>
                                    Adicionar um campo
                                </Button>
                            </div>

                            {/* <FormLabel className="text-[12px]">Pequeno-almoço</FormLabel>
                            <div className="flex justify-between gap-4">
                                <FormField
                                    control={form.control}
                                    name="pequeno_almoco"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input placeholder="Pequeno-almoço" {...field} className="text-[13px]" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                            </div> */}


                            <FormLabel className="text-[12px]">Refeição especial</FormLabel>
                            <div className="flex flex-col mb-2">
                                <FormField
                                    control={form.control}
                                    name="extras1"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input placeholder="Refeição especial" {...field} className="text-[13px]" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                            </div>


                            <FormLabel className="text-[12px]">1º Almoço</FormLabel>
                            <div className="flex flex-col gap-2">
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
                                    {am1Counter >= 1 ?
                                    <FormField
                                    control={form.control}
                                    name="almoco1_extra1"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input placeholder="1º Almoço" className="text-[13px]" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} /> : ''}
                                    {am1Counter >= 2 ?
                                    <FormField
                                    control={form.control}
                                    name="almoco1_extra2"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input placeholder="1º Almoço" className="text-[13px]" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} /> : ''}
                                    <Button variant="link" type="button" onClick={() => setAm1Counter(++am1Counter)} className="w-fit text-blue-400 hover:no-underline p-0 h-auto text-[11px] mt-0 mb-1">
                                    <i className="ri-add-line"></i>
                                    Adicionar um campo
                                </Button>

                                
                            <FormLabel className="text-[12px]">2º Almoço</FormLabel>
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
                                    {am2Counter >= 1 ?
                                    <FormField
                                    control={form.control}
                                    name="almoco2_extra1"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input placeholder="2º Almoço" className="text-[13px]" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} /> : ''}
                                    {am2Counter >= 2 ?
                                    <FormField
                                    control={form.control}
                                    name="almoco2_extra2"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input placeholder="2º Almoço" className="text-[13px]" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} /> : ''}
                                    <Button variant="link" type="button" onClick={() => setAm2Counter(++am2Counter)} className="w-fit text-blue-400 hover:no-underline p-0 h-auto text-[11px] mt-0 mb-2">
                                    <i className="ri-add-line"></i>
                                    Adicionar um campo
                                </Button>
                            </div>


                            <FormLabel className="text-[12px]">Sobremesa</FormLabel>
                            <div className="flex flex-col gap-2">
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
                                    {sbCounter >= 1 ?
                                    <FormField
                                    control={form.control}
                                    name="sobremesa_extra1"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input placeholder="Sobremesa" className="text-[13px]" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} /> : ''}
                                    {sbCounter >= 2 ?
                                    <FormField
                                    control={form.control}
                                    name="sobremesa_extra2"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input placeholder="Sobremesa" className="text-[13px]" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} /> : ''}
                                    <Button variant="link" type="button" onClick={() => setSbCounter(++sbCounter)} className="w-fit text-blue-400 hover:no-underline p-0 h-auto text-[11px] mt-0 mb-2">
                                    <i className="ri-add-line"></i>
                                    Adicionar um campo
                                </Button>
                            </div>


                            <FormLabel className="text-[12px]">Refeição especial</FormLabel>
                            <div className="flex justify-between gap-4 mb-2">
                                <FormField
                                    control={form.control}
                                    name="extras2"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input placeholder="Refeição especial" {...field} className="text-[13px]" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                            </div>


                            <FormLabel className="text-[12px]">Lanche</FormLabel>
                            <div className="flex flex-col gap-2">
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
                                    {lnCounter >= 1 ?
                                    <FormField
                                    control={form.control}
                                    name="lanche_extra1"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input placeholder="Lanche" className="text-[13px]" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} /> : ''}
                                    {lnCounter >= 2 ?
                                    <FormField
                                    control={form.control}
                                    name="lanche_extra2"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input placeholder="Lanche" className="text-[13px]" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} /> : ''}
                                    
                                    <Button variant="link" type="button" onClick={() => setLnCounter(++lnCounter)} className="w-fit text-blue-400 hover:no-underline p-0 h-auto text-[11px] mt-0 mb-2">
                                    <i className="ri-add-line"></i>
                                    Adicionar um campo
                                </Button>
                            </div>

                        </div>
                    </div>
                </div>
                <Button type="submit" className="mt-4">Guardar</Button>
            </form>
        </Form>
    )
}