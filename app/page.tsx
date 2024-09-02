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
import React, { useState } from "react"
import { CardTitle } from "@/components/ui/card"
import { initiateSession } from "@/lib/api"
import { toast } from 'sonner';
import { useRouter } from "next/navigation"


const FormSchema = z.object({
  username: z.string().min(1, {
    message: "Digite o nome do usuário.",
  }),
  password: z.string().min(1, {
    message: "Digite a senha.",
  }),
})


const SignIn: React.FC = () => {
  
  const [isSubmitting, setSubmitting] = useState(false)
  
  const loadHandler = (state: boolean) => {
    setSubmitting(!state)
  }

  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const OnSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      loadHandler(isSubmitting);
      const response = await initiateSession(data);

      if(response?.ok) {
        router.push('/home')
      } else {
        toast('Ops... Algo deu errado', {
          description: 'Verifique os dados e tente novamente.',
          duration: 5000,
          cancel: {
            label: 'Fechar',
            onClick: () => console.log('Cancel!'),
          },
        })
      }
    } catch(error) {
      console.log(error)
    } finally {
      loadHandler(!isSubmitting);
    }
}

  return (
    <div className="h-full min-h-screen flex justify-center items-center">
      <Form {...form}>
      <form onSubmit={form.handleSubmit(OnSubmit)} className="flex flex-col gap-4 w-full max-w-[320px] shadow-md py-6 px-5 self-center border border-slate-200 rounded-lg">
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
                <Input type="password" placeholder="" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full mt-4 text-[13px]">
                {isSubmitting ? (
                  <i className="ri-loader-line animate-spin text-[14px]"></i>
                )
                : (
                  <>
                    {/* <i className="ri-download-line mr-2 text-[14px]"></i> */}
                    Submeter
                  </>
                )}
              </Button>
      </form>
    </Form>
    </div>
  )
}

export default SignIn
