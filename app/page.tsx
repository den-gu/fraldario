"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
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
import React from "react"
import { CardTitle } from "@/components/ui/card"
import { signIn } from "@/lib/api"
import { Toaster, toast } from 'sonner';


const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
})

// const ShowToast = () => {
// }

const SignIn: React.FC = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const OnSubmit = (data: z.infer<typeof FormSchema>) => {

    // console.log(data)

    toast('My first toast')

    signIn(data)
  
}

  return (
    <div className="h-full min-h-screen flex justify-center items-center">
      <Toaster />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(OnSubmit)} className="flex flex-col gap-4 w-full max-w-[350px] shadow-md py-6 px-5 self-center border border-slate-200 rounded-lg">
        <CardTitle className="text-center text-[18px]">O Fraldario</CardTitle>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px]">Usuário</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription>
                Digite o nome de usuário associado a sua conta.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px]">Senha</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full mt-4 text-[13px]">Submeter</Button>
      </form>
    </Form>
    </div>
  )
}

export default SignIn
