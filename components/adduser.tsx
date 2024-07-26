import * as React from "react"
 
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@react-hook/media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardTitle } from "./ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@radix-ui/react-select"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "./ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { addStudent } from "@/lib/api"


const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().min(2).max(50),
  parent: z.string().min(2).max(50),
  class: z.string().min(1).max(10),
  year: z.string().min(1).max(5),
})

export function AddUser() {

    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")
   
    if (isDesktop) {
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
          <Button
            variant="default"
            className="hidden sm:flex items-center text-[13px]"
          >
            <i className="ri-sticky-note-add-line mr-2 text-[14px]"></i>
            {/* <i className="ri-add-line text-[14px] font-thin"></i> */}
            Novo
          </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            {/* <DialogHeader>
              <DialogTitle>Novo aluno</DialogTitle> */}
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
            variant="secondary"
            className="items-center h-10 gap-1 text-[13px]"
          >
            <i className="ri-sticky-note-add-line text-[14px]"></i>
            {/* <i className="ri-add-line text-[14px] font-thin"></i> */}
            Novo
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          {/* <DrawerHeader className="text-left">
            <DrawerTitle>Edit profile</DrawerTitle> */}
            {/* <DrawerDescription>
              Make changes to your profile here. Click save when you are done.
            </DrawerDescription> */}
          {/* </DrawerHeader> */}
          <CreateUserForm className="px-4" />
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

function CreateUserForm({ className }: React.ComponentProps<"form">) {

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      parent: "",
      class: "",
      year: "",
    },
  })


    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {

      try {
        await addStudent(values)
      } catch (error) {
        console.log(error)
      }
    }
  
    return (
      // <form className={cn("grid items-start gap-4", className)}>
        <Tabs defaultValue="student" className="overflow-visible">
          <TabsList className="flex justify-center mt-2 mb-4">
            <TabsTrigger value="student" className="text-[13px]">Aluno</TabsTrigger>
            <TabsTrigger value="class" className="text-[13px]">Turma</TabsTrigger>
          </TabsList>
            <TabsContent value="student">
            {/* <CardTitle className="text-[15px] text-black mb-4">Novo aluno</CardTitle> */}
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
              <div className="flex gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-[13px]">Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              <FormField
                control={form.control}
                name="parent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-[13px]">Parente</FormLabel>
                    <FormControl>
                      <Input placeholder="..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="flex w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-muted-foreground text-[13px]">E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="flex gap-4">
              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-[13px]">Turma</FormLabel>
                    <FormControl>
                      <Input placeholder="..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-[13px]">Ano</FormLabel>
                    <FormControl>
                      <Input placeholder="..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

            <Button type="submit" className="w-fit self-end text-[12px] mt-2">Adicionar</Button>
            </form>
        </Form>
          </TabsContent>
          <TabsContent value="class">Change your class here.</TabsContent>
        </Tabs>
    )
  }