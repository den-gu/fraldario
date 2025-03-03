import React, {useState} from "react"
 
import { useMediaQuery } from "@react-hook/media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { CardTitle } from "./ui/card"
import { FormField, FormItem, FormControl, FormMessage, Form, FormLabel } from "./ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { addStudent } from "@/lib/api"
import { Toaster, toast } from 'sonner';


const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().min(2),
  parent: z.string().min(2),
})

export function AddStudent() {

    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")
   
    // if (isDesktop) {
      return (
            <CreateUserForm />
      )
    }

function CreateUserForm({ className }: React.ComponentProps<"form">) {

  const [isSubmitting, setSubmitting] = useState(false)

  const submitHandler = (state: boolean) => {
    setSubmitting(!state)
    setTimeout(() => {
      setSubmitting(state)
      toast('Sucesso', {
        description: 'Aluno cadastrado.',
        duration: 5000,
        cancel: {
          label: 'Fechar',
          onClick: () => console.log('Cancel!'),
        },
      })
    }, 2000);
  }
  
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      parent: "",
    },
  })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {

      try {
        submitHandler(isSubmitting)
        await addStudent(values)
      } catch (error) {
        console.log(error)
    }
  }
  
    return (
      <React.Fragment>
            <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="h-auto">
                        <div className="grid gap-7 grid-cols-4">
                            <div className="col-span-4 gap-4">
                                <div className="flex flex-col gap-3">
                                    
                      <FormLabel className="text-[12px]">Nome da criança</FormLabel>
                      <div className="flex justify-between gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    {/* <FormLabel className="text-muted-foreground text-[13px]">Pequeno-almoço</FormLabel> */}
                                                    <FormControl>
                                                        <Input placeholder="Nome da criança" type="text" {...field} className="text-[13px]" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                    </div>

                                    
                      <FormLabel className="text-[12px]">E-mail</FormLabel>
                      <div className="flex justify-between gap-4">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormControl>
                                                        <Input placeholder="E-mail" type="email" {...field} className="text-[13px]" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                    </div>

                                    
                      <FormLabel className="text-[12px]">Nome do parente</FormLabel>
                      <div className="flex justify-between gap-4">
                                        <FormField
                                            control={form.control}
                                            name="parent"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormControl>
                                                        <Input placeholder="Nome do parente" type="text" {...field} className="text-[13px]" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                    </div>
                                </div>
                            </div>
                        </div>
                {/* <SheetFooter className="mt-4">
                    <SheetClose asChild> */}
                        {/* <Button type="submit" className='mt-5'>Guardar</Button> */}

                        <Button type="submit" disabled={isSubmitting} className="w-full md:w-fit flex items-center mt-4">
                            {isSubmitting ? <i className="ri-loader-line animate-spin text-[14px]"></i> : `Guardar` }
                        </Button>
                    {/* </SheetClose>
                </SheetFooter> */}
                </form>
                </Form>
      </React.Fragment>
    )
  }