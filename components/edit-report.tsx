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
import { toast } from "sonner"
import { addMeal, updateReport } from "@/lib/api"
import { useMediaQuery } from "@react-hook/media-query"
import { deleteStudent, getMeals, getStudents, saveReport, sendReport } from "@/lib/api"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select"
import { CardTitle } from "./ui/card"
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "./ui/form"
import { Textarea } from "./ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"


type Report = {
    id: string;
    created_at: string;
    student_name: string,
    behavior: string,
    pequeno_almoco: string,
    almoco1: string,
    almoco2: string,
    sobremesa: string,
    lanche: string,
    extras1: string,
    extras2: string,
    porcao_pequeno_almoco: string,
    porcao_almoco1: string,
    porcao_almoco2: string,
    porcao_sobremesa: string,
    porcao_lanche: string,
    porcao_extras1: string,
    porcao_extras2: string,
    fezes: string,
    nr_fezes: string,
    vomitos: string,
    nr_vomitos: string,
    febres: string,
    nr_febres: string,
    message: string,
    email?: string,
}

type Student = {
    id: string | undefined;
    name: string | undefined;
    email: string | undefined;
  }
  
  type Meal = {
    pequeno_almoco: string | undefined;
    almoco1: string | undefined;
    almoco2: string | undefined;
    sobremesa: string | undefined; 
    lanche: string | undefined;
    extras1: string | undefined,
    extras2: string | undefined,
  }
  
  const formSchema = z.object({
    id: z.string().optional(),
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
    nr_febres: z.string().optional(),
    message: z.string().max(300).optional(),
  })

export function EditReport(data: Report) {

    const [isSubmitting, setSubmitting] = useState(false)
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

    const loadHandler = (state: boolean) => {
        setLoading(!state)
    }

    const sendingHandler = (state: boolean) => {
        setSubmitting(!state)
        setTimeout(() => {
            toast('Sucesso', {
                description: 'A informação foi modificada.',
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
        //   student_name: data.student_name || "",
        //   email: data.email || "",
        //   pequeno_almoco: data.pequeno_almoco || "",
        //   almoco1: lastMeal?.almoco1 || "",
        //   almoco2: lastMeal?.almoco2 || "",
        //   sobremesa: lastMeal?.sobremesa || "",
        //   lanche: lastMeal?.lanche || "",
        //   extras1: lastMeal?.extras1 || "",
        //   extras2: lastMeal?.extras2 || "",
        //   porcao_pequeno_almoco: "",
        //   porcao_almoco1: "",
        //   porcao_almoco2: "",
        //   porcao_sobremesa: "",
        //   porcao_lanche: "",
        //   porcao_extras1: "",
        //   porcao_extras2: "",
        id: data.id,
        student_name: data.student_name,
        email: data.email,
        behavior: data.behavior,
        pequeno_almoco: data.pequeno_almoco,
        almoco1: data.almoco1,
        almoco2: data.almoco2,
        sobremesa: data.sobremesa,
        lanche: data.lanche,
        extras1: data.extras1,
        extras2: data.extras2,
        porcao_pequeno_almoco: data.porcao_pequeno_almoco,
        porcao_almoco1: data.porcao_almoco1,
        porcao_almoco2: data.porcao_almoco2,
        porcao_sobremesa: data.porcao_sobremesa,
        porcao_lanche: data.porcao_lanche,
        porcao_extras1: data.porcao_extras1,
        porcao_extras2: data.porcao_extras2,
        fezes: data.fezes,
        vomitos: data.vomitos,
        febres: data.febres,
        },
      })

    const [state, setState] = useState({
        id: data.id,
        student_name: data.student_name,
        email: data.email,
        behavior: data.behavior,
        pequeno_almoco: data.pequeno_almoco,
        almoco1: data.almoco1,
        almoco2: data.almoco2,
        sobremesa: data.sobremesa,
        lanche: data.lanche,
        extras1: data.extras1,
        extras2: data.extras2,
        porcao_pequeno_almoco: data.porcao_pequeno_almoco,
        porcao_almoco1: data.porcao_almoco1,
        porcao_almoco2: data.porcao_almoco2,
        porcao_sobremesa: data.porcao_sobremesa,
        porcao_lanche: data.porcao_lanche,
        porcao_extras1: data.porcao_extras1,
        porcao_extras2: data.porcao_extras2,
        fezes: data.fezes,
        vomitos: data.vomitos,
        febres: data.febres,
      })


      // Modificando um dos estados
    const updateField = (field: any, value: any) => {
        setState((prevState) => ({
          ...prevState,
          [field]: value,
        }));
      };


    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {

        console.log(values)
        
        try {
              sendingHandler(loading);
              await updateReport(values);
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <Sheet>
            <SheetTrigger asChild>
            <Button variant="link" className="flex items-center text-blue-400 text-[13px] px-2">
                <i className="ri-eye-line mr-1 text-[13px]"></i>
                Ver
            </Button>
            </SheetTrigger>
            <SheetContent className="min-w-full md:min-w-[600px] overflow-y-scroll">
                <SheetHeader>
                    <SheetTitle>Relatório diário</SheetTitle>
                    <SheetDescription>
                        Edite a informação do aluno e clique em &#34;Actualizar&#34; assim que terminar.
                    </SheetDescription>
                </SheetHeader>
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
                        <Input defaultValue={data.student_name} placeholder={data.student_name} disabled {...field}
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
                        value={data.behavior}  // Use value instead of defaultValue
                        onValueChange={(e) => {
                          field.onChange(e);
                          updateField('behavior', e);
                        }} required>
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder={data.behavior} className="text-[13px]" {...field} />
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

              <div className="hidden">
              <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input defaultValue={data.id} placeholder={data.id} disabled {...field} hidden
                          className="disabled:placeholder:text-[#000000] text-[13px] hidden" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
              </div>
  
              {/* <CardTitle className="text-left text-[13px]">Refeições</CardTitle> */}
              <div className="flex justify-between gap-4">
                <FormField
                  control={form.control}
                  name="pequeno_almoco"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-[12px]">Pequeno-almoço</FormLabel>
                      <FormControl>
                        <Input placeholder={data.pequeno_almoco} className="text-[13px]" disabled {...field}
                          defaultValue={data.pequeno_almoco}
                          />
                      </FormControl>
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
                            <SelectValue placeholder={data.porcao_pequeno_almoco} className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem className="text-[13px]" value="2 Porções">2 Porções</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção">1 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/2 Porção">1/2 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/4 Porção">1/4 Porção</SelectItem>
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
                  name="extras1"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-[12px]">Refeição extra da manhã</FormLabel>
                      <FormControl>
                        <Input placeholder={data.extras1} className="text-[13px]" disabled {...field}
                          defaultValue={data.extras1} />
                      </FormControl>
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
                            <SelectValue placeholder={data.porcao_extras1} className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem className="text-[13px]" value="2 Porções">2 Porções</SelectItem>
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
                      <FormLabel className="text-[12px]">1º Almoço</FormLabel>
                      <FormControl>
                        <Input placeholder={data.almoco1} className="text-[13px]" disabled {...field}
                          defaultValue={data.almoco1} />
                      </FormControl>
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
                            <SelectValue placeholder={data.porcao_almoco1} className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem className="text-[13px]" value="2 Porções">2 Porções</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção">1 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/2 Porção">1/2 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/4 Porção">1/4 Porção</SelectItem>
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
                      <FormLabel className="text-[12px]">2º Almoço</FormLabel>
                      <FormControl>
                        <Input placeholder={data.almoco2} className="text-[13px]" disabled {...field}
                          defaultValue={data.almoco2} />
                      </FormControl>
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
                            <SelectValue placeholder={data.porcao_almoco2} className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem className="text-[13px]" value="2 Porções">2 Porções</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção">1 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/2 Porção">1/2 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/4 Porção">1/4 Porção</SelectItem>
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
                      <FormLabel className="text-[12px]">Sobremesa</FormLabel>
                      <FormControl>
                        <Input placeholder={data.sobremesa} className="text-[13px]" disabled {...field}
                          defaultValue={data.sobremesa} />
                      </FormControl>
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
                            <SelectValue placeholder={data.porcao_sobremesa} className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem className="text-[13px]" value="2 Porções">2 Porções</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção">1 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/2 Porção">1/2 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/4 Porção">1/4 Porção</SelectItem>
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
                      <FormLabel className="text-[12px]">Lanche</FormLabel>
                      <FormControl>
                        <Input placeholder={data.lanche} className="text-[13px]" disabled {...field}
                          defaultValue={data.lanche} />
                      </FormControl>
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
                            <SelectValue placeholder={data.porcao_lanche} className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem className="text-[13px]" value="2 Porções">2 Porções</SelectItem>
                        <SelectItem className="text-[13px]" value="1 Porção">1 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/2 Porção">1/2 Porção</SelectItem>
                        <SelectItem className="text-[13px]" value="1/4 Porção">1/4 Porção</SelectItem>
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
                  name="extras2"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-[12px]">Refeição extra da tarde</FormLabel>
                      <FormControl>
                        <Input placeholder={data.extras2} className="text-[13px]" disabled {...field}
                          defaultValue={data.extras2} />
                      </FormControl>
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
                            <SelectValue placeholder={data.porcao_extras2} className="text-[13px]" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem className="text-[13px]" value="2 Porções">2 Porções</SelectItem>
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
                          value={state.fezes}
                        onValueChange={(e) => {
                          field.onChange(e);  // Chama o onChange original do field
                          updateField('fezes', e);  // Chama a função que actualiza o estado
                        }} required>
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder={data.fezes} className="text-[13px]" {...field} />
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
                      value={state.vomitos}
                        onValueChange={(e) => {
                          field.onChange(e);  // Chama o onChange original do field
                          updateField('vomitos', e);  // Chama a função que actualiza o estado
                        }} required>
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder={data.vomitos} className="text-[13px]" {...field} />
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
                      value={state.febres}
                        onValueChange={(e) => {
                          field.onChange(e);  // Chama o onChange original do field
                          updateField('febres', e);  // Chama a função que actualiza o estado
                        }} required>
                        <FormControl>
                          <SelectTrigger className="w-full text-[13px]">
                            <SelectValue placeholder={data.febres} className="text-[13px]" {...field} />
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
                        <Input placeholder={data.nr_fezes} type="number" className="text-[13px]" {...field} min={1} />
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
                        <Input placeholder={data.nr_vomitos} type="number" className="text-[13px]" {...field} min={1} />
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
                        <Input placeholder={`${data.nr_febres}° C`} type="number" className="text-[13px]" {...field} min={1} />
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
                          placeholder={data.message}
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
  
            <Button type="submit" disabled={saving} className="w-full md:w-fit flex items-center text-[13px] mt-5">
              {saving ? <i className="ri-loader-line animate-spin text-[14px]"></i> : `Actualizar` }
            </Button>
            {/* </div>
          </div> */}
        </form>
      </Form>
            </SheetContent>
        </Sheet>
    )
}