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
import { addStudent, sendMessage } from "@/lib/api"
import { Toaster, toast } from 'sonner';
import { Textarea } from "./ui/textarea"


const formSchema = z.object({
  subject: z.string().min(2),
  message: z.string().min(2),
})

export function AddMessage() {

    const [open, setOpen] = React.useState(false)
   
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
        description: 'Mensagem enviada.',
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
      subject: "",
      message: ""
    },
  })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {

      try {
        submitHandler(isSubmitting)
        await sendMessage(values)
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
                                    <div className="flex justify-between gap-4">
                                        <FormField
                                            control={form.control}
                                            name="subject"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel className="text-[12px]">Assunto</FormLabel>
                                                    {/* <FormLabel className="text-muted-foreground text-[13px]">Pequeno-almoço</FormLabel> */}
                                                    <FormControl>
                                                        <Input placeholder="Assunto" type="text" {...field} className="text-[13px]" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                    </div>

                                    <div className="flex justify-between gap-4">
                                    <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-[12px]">Texto</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Deixe a sua mensagem"
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
                        </div>

                        <Button type="submit" disabled={isSubmitting} className="w-full md:w-fit flex items-center mt-4">
                            {isSubmitting ? <i className="ri-loader-line animate-spin text-[14px]"></i> : `Enviar` }
                        </Button>
                </form>
                </Form>
      </React.Fragment>
    )
  }