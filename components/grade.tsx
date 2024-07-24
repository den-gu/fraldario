"use client"

import React from "react"
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

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { CardTitle } from "./ui/card"

const formSchema = z.object({
    username: z.string().min(2).max(50),
  })

export default function Grade() {

      // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <React.Fragment>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 flex items-end gap-4">
        {/* <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <div>
        <CardTitle className="text-md text-black">Turma</CardTitle>
        <Select>
      <SelectTrigger className="w-[180px] text-muted-foreground">
        <SelectValue placeholder="..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/* <SelectLabel>Ano</SelectLabel> */}
          <SelectItem value="apple">T1</SelectItem>
          <SelectItem value="banana">T2</SelectItem>
          <SelectItem value="blueberry">T3</SelectItem>
          <SelectItem value="grapes">T4</SelectItem>
          <SelectItem value="pineapple">T5</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
        </div>


   <div>
   <CardTitle className="text-md text-black">Ano</CardTitle>
    <Select>
      <SelectTrigger className="w-[180px] text-muted-foreground">
        <SelectValue placeholder="..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/* <SelectLabel>Ano</SelectLabel> */}
          <SelectItem value="apple">1</SelectItem>
          <SelectItem value="banana">2</SelectItem>
          <SelectItem value="blueberry">3</SelectItem>
          <SelectItem value="grapes">4</SelectItem>
          <SelectItem value="pineapple">5</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
   </div>

        <Button type="submit">
        <i className="ri-equalizer-2-line mr-2"></i>
            Filtrar
        </Button>
      </form>
    </Form>
    </React.Fragment>
  )
}


// ID, Nome, Turma, Ano, Email