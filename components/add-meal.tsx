"use client"

import React, { useState, useEffect} from "react"

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
import { supabase } from "@/lib/supabaseClient"

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
    extras1: string | undefined;
    extras2: string | undefined;
  }

const formSchema = z.object({
    pequeno_almoco: z.string({required_error: "Preencha este campo"}).min(1, {message: "Campo obrigatório"}),
    pequeno_almoco_extra1: z.string().optional(),
    pequeno_almoco_extra2: z.string().optional(),
    almoco1: z.string({required_error: "Preencha este campo"}).min(1, {message: "Campo obrigatório"}),
    almoco1_extra1: z.string().optional(),
    almoco1_extra2: z.string().optional(),
    almoco2: z.string({required_error: "Preencha este campo"}).min(1, {message: "Campo obrigatório"}),
    almoco2_extra1: z.string().optional(),
    almoco2_extra2: z.string().optional(),
    sobremesa: z.string({required_error: "Preencha este campo"}).min(1, {message: "Campo obrigatório"}),
    sobremesa_extra1: z.string().optional(),
    sobremesa_extra2: z.string().optional(),
    lanche: z.string({required_error: "Preencha este campo"}).min(1, {message: "Campo obrigatório"}),
    lanche_extra1: z.string().optional(),
    lanche_extra2: z.string().optional(),
    extras1: z.string({required_error: "Preencha este campo"}).min(1, {message: "Campo obrigatório"}),
    extras2: z.string({required_error: "Preencha este campo"}).min(1, {message: "Campo obrigatório"}),
})

export function AddMeal() {

    const [isSubmitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)
    const [lastMeal, setLastMeal] = useState<Meal | null>(null);
    const [disabled, setDisabled] = useState(true)
  
    let [pCounter, setPCounter] = useState(0)
    let [am1Counter, setAm1Counter] = useState(0)
    let [am2Counter, setAm2Counter] = useState(0)
    let [sbCounter, setSbCounter] = useState(0)
    let [lnCounter, setLnCounter] = useState(0)

    const loadHandler = (state: boolean) => {
        setLoading(!state)
    }

    const sendingHandler = (state: boolean) => {
        setLoading(!state)
        setTimeout(() => {
            toast('Sucesso', {
                description: 'A refeição do dia foi adicionada.',
                duration: 12000,
                cancel: {
                    label: 'Fechar',
                    onClick: () => console.log('Cancel!'),
                },
            })
            setLoading(state)
        }, 2000);
    }

  useEffect(() => {
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

        if (data?.pequeno_almoco_extra1 !== undefined && data?.pequeno_almoco_extra1 !== null && data?.pequeno_almoco_extra1 !== "") {
          setPCounter(1);
        }
        if (data?.pequeno_almoco_extra2 !== undefined && data?.pequeno_almoco_extra2 !== null && data?.pequeno_almoco_extra2 !== "") {
          setPCounter(2);
        }
        if (data?.almoco1_extra1 !== undefined && data?.almoco1_extra1 !== null && data?.almoco1_extra1 !== "") {
          setAm1Counter(1);
        }
        if (data?.almoco1_extra2 !== undefined && data?.almoco1_extra2 !== null && data?.almoco1_extra2 !== "") {
          setAm1Counter(2);
        }
        if (data?.almoco2_extra1 !== undefined && data?.almoco2_extra1 !== null && data?.almoco2_extra1 !== "") {
          setAm2Counter(1);
        }
        if (data?.almoco2_extra2 !== undefined && data?.almoco2_extra2 !== null && data?.almoco2_extra2 !== "") {
          setAm2Counter(2);
        }
        if (data?.sobremesa_extra1 !== undefined && data?.sobremesa_extra1 !== null && data?.sobremesa_extra1 !== "") {
          setSbCounter(1);
        }
        if (data?.sobremesa_extra2 !== undefined && data?.sobremesa_extra2 !== null && data?.sobremesa_extra2 !== "") {
          setSbCounter(2);
        }
        if (data?.lanche_extra1 !== undefined && data?.lanche_extra1 !== null && data?.lanche_extra1 !== "") {
          setLnCounter(1);
        }
        if (data?.lanche_extra2 !== undefined && data?.lanche_extra2 !== null && data?.lanche_extra2 !== "") {
          setLnCounter(2);
        }
      }
    };

    fetchLastMeal();

    if (lastMeal) {
    form.reset({
      pequeno_almoco: lastMeal.pequeno_almoco,
      pequeno_almoco_extra1: lastMeal.pequeno_almoco_extra1,
      pequeno_almoco_extra2: lastMeal.pequeno_almoco_extra2,
      almoco1: lastMeal.almoco1,
      almoco1_extra1: lastMeal.almoco1_extra1,
      almoco1_extra2: lastMeal.almoco1_extra2,
      almoco2: lastMeal.almoco2,
      almoco2_extra1: lastMeal.almoco2_extra1,
      almoco2_extra2: lastMeal.almoco2_extra2,
      sobremesa: lastMeal.sobremesa,
      sobremesa_extra1: lastMeal.sobremesa_extra1,
      sobremesa_extra2: lastMeal.sobremesa_extra2,
      lanche: lastMeal.lanche,
      lanche_extra1: lastMeal.lanche_extra1,
      lanche_extra2: lastMeal.lanche_extra2,
      extras1: lastMeal.extras1,
      extras2: lastMeal.extras2,
    });
  }
  }, []);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        //pequeno_almoco: lastMeal?.pequeno_almoco,
        pequeno_almoco_extra1: lastMeal?.pequeno_almoco_extra1,
        pequeno_almoco_extra2: lastMeal?.pequeno_almoco_extra2,
        almoco1: lastMeal?.almoco1,
        almoco1_extra1: lastMeal?.almoco1_extra1,
        almoco1_extra2: lastMeal?.almoco1_extra2,
        almoco2: lastMeal?.almoco2,
        almoco2_extra1: lastMeal?.almoco2_extra1,
        almoco2_extra2: lastMeal?.almoco2_extra2,
        sobremesa: lastMeal?.sobremesa,
        sobremesa_extra1: lastMeal?.sobremesa_extra1,
        sobremesa_extra2: lastMeal?.sobremesa_extra2,
        lanche: lastMeal?.lanche,
        lanche_extra1: lastMeal?.lanche_extra1,
        lanche_extra2: lastMeal?.lanche_extra2,
        extras1: lastMeal?.extras1,
        extras2: lastMeal?.extras2,
        
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

  const handleReset = () => {
      setLastMeal(null);
      setPCounter(0);
      setAm1Counter(0);
      setAm2Counter(0);
      setSbCounter(0);
      setLnCounter(0);
   }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="h-auto">
                <div className="grid gap-7 grid-cols-4">
                    <div className="col-span-4 gap-4">
                      {/*<p className="text-[12px]">
                        Edite a refeição do dia e clique em &#34;Guardar&#34; assim que terminar.
                    </p>
                    <Button variant="outline" onClick={() => setDisabled(false)} className="w-full md:w-fit my-2">
                      <i className="ri-edit-line mr-1 text-[14px]"></i>
                      Editar
                    </Button>*/}
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
                                                <Input value={lastMeal?.pequeno_almoco} placeholder="Pequeno-almoço" className="disabled:placeholder:text-[#000000] text-[13px]" />
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
                                                    <Input defaultValue={lastMeal?.pequeno_almoco_extra1} placeholder="Pequeno-almoço" {...field} className="disabled:placeholder:text-[#000000] text-[13px]" />
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
                                                    <Input defaultValue={lastMeal?.pequeno_almoco_extra2} placeholder="Pequeno-almoço" {...field} className="text-[13px]" />
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


                            <FormLabel className="text-[12px]">Snack</FormLabel>
                            <div className="flex flex-col mb-2">
                                <FormField
                                    control={form.control}
                                    name="extras1"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input defaultValue={lastMeal?.extras1} placeholder="Snack" {...field} className="text-[13px]" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                            </div>


                            <FormLabel className="text-[12px]">Almoço (Entrada)</FormLabel>
                            <div className="flex flex-col gap-2">
                                <FormField
                                    control={form.control}
                                    name="almoco1"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input placeholder="Almoço (Entrada)" {...field} className="text-[13px]" />
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
                                                <Input defaultValue={lastMeal?.almoco1_extra1} placeholder="Almoço (Entrada)" className="text-[13px]" {...field} />
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
                                                <Input defaultValue={lastMeal?.almoco1_extra2} placeholder="Almoço (Entrada)" className="text-[13px]" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} /> : ''}
                                    <Button variant="link" type="button" onClick={() => setAm1Counter(++am1Counter)} className="w-fit text-blue-400 hover:no-underline p-0 h-auto text-[11px] mt-0 mb-1">
                                    <i className="ri-add-line"></i>
                                    Adicionar um campo
                                </Button>

                                
                            <FormLabel className="text-[12px]">Prato principal</FormLabel>
                                <FormField
                                    control={form.control}
                                    name="almoco2"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input defaultValue={lastMeal?.almoco2} placeholder="Prato principal" className="text-[13px]" {...field} />
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
                                                <Input defaultValue={lastMeal?.almoco2_extra1} placeholder="Prato principal" className="text-[13px]" {...field} />
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
                                                <Input defaultValue={lastMeal?.almoco2_extra2} placeholder="Prato principal" className="text-[13px]" {...field} />
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
                                                <Input defaultValue={lastMeal?.sobremesa} placeholder="Sobremesa" className="text-[13px]" {...field} />
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
                                                <Input defaultValue={lastMeal?.sobremesa_extra1} placeholder="Sobremesa" className="text-[13px]" {...field} />
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
                                                <Input defaultValue={lastMeal?.sobremesa_extra2} placeholder="Sobremesa" className="text-[13px]" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} /> : ''}
                                    <Button variant="link" type="button" onClick={() => setSbCounter(++sbCounter)} className="w-fit text-blue-400 hover:no-underline p-0 h-auto text-[11px] mt-0 mb-2">
                                    <i className="ri-add-line"></i>
                                    Adicionar um campo
                                </Button>
                            </div>


                            <FormLabel className="text-[12px]">Snack</FormLabel>
                            <div className="flex justify-between gap-4 mb-2">
                                <FormField
                                    control={form.control}
                                    name="extras2"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input defaultValue={lastMeal?.extras2} placeholder="Snack" {...field} className="text-[13px]" />
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
                                                <Input defaultValue={lastMeal?.lanche} placeholder="Lanche" className="text-[13px]" {...field} />
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
                                                <Input defaultValue={lastMeal?.lanche_extra1} placeholder="Lanche" className="text-[13px]" {...field} />
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
                                                <Input defaultValue={lastMeal?.lanche_extra2} placeholder="Lanche" className="text-[13px]" {...field} />
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
              <div className="w-full flex items-center gap-4 mt-4">
                <Button type="button" disabled={loading} onClick={handleReset} variant="secondary" className="w-full md:w-fit text-[13px]">
              Limpar campos
            </Button>
                <Button type="submit" disabled={loading} className="w-full md:w-fit text-[13px]">
                    {loading ? <i className="ri-loader-line animate-spin text-[14px]"></i> : `Guardar`}
                </Button>
                </div>
            </form>
        </Form>
    )
}
