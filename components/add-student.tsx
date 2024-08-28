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
import { FormField, FormItem, FormControl, FormMessage, Form } from "./ui/form"
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
   
    if (isDesktop) {
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
          <Button
          variant="outline"
            className="hidden sm:flex items-center text-[14px]"
          >
            <i className="ri-file-add-line mr-2 text-[14px]"></i>
            {/* <i className="ri-user-3-line text-[15px] font-thin mr-2"></i> */}
            Aluno
          </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
              <DialogTitle>Adicionar aluno</DialogTitle>
            </DialogHeader>
            {/* <DialogHeader>
              <DialogTitle>Aluno aluno</DialogTitle> */}
              {/* <DialogDescription>
                Make changes to your profile here. Click save when you are done.
              </DialogDescription> */}
            {/* </DialogHeader> */}
            <CreateUserForm />
          </DialogContent>
        </Dialog>
      )
    }
   
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
        <Button
          variant="outline"
            className="items-center h-10 gap-1 text-[12px]"
          >
            <i className="ri-file-add-line text-[14px]"></i>
            {/* <i className="ri-add-line text-[14px] font-thin"></i> */}
            Aluno
          </Button>
        </DrawerTrigger>
        <DrawerContent className="px-5">
          <CreateUserForm />
          <DrawerFooter className="px-0">
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
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
                        <div className="grid gap-7 grid-cols-4 mt-5">
                            <div className="col-span-4 gap-4">
                                <div className="flex flex-col gap-3">
                                    <CardTitle className="text-left text-[13px]">Nome da criança</CardTitle>
                                    <div className="flex justify-between gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    {/* <FormLabel className="text-muted-foreground text-[13px]">Pequeno-almoço</FormLabel> */}
                                                    <FormControl>
                                                        <Input placeholder="" type="text" {...field} className="text-[13px]" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                    </div>

                                    <CardTitle className="text-left text-[13px]">E-mail</CardTitle>
                                    <div className="flex justify-between gap-4">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormControl>
                                                        <Input placeholder="" type="email" {...field} className="text-[13px]" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                    </div>

                                    <CardTitle className="text-left text-[13px]">Nome do parente</CardTitle>
                                    <div className="flex justify-between gap-4">
                                        <FormField
                                            control={form.control}
                                            name="parent"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormControl>
                                                        <Input placeholder="" type="text" {...field} className="text-[13px]" />
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

                        <Button type="submit" disabled={isSubmitting} className="w-full md:w-fit flex items-center text-[13px] mt-5">
                            {isSubmitting ? <i className="ri-loader-line animate-spin text-[14px]"></i> : `Adicionar` }
                        </Button>
                    {/* </SheetClose>
                </SheetFooter> */}
                </form>
                </Form>
      </React.Fragment>
    )
  }