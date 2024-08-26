"use client"

import React, { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form'
import { CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { SheetFooter, SheetClose } from './ui/sheet'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { editStudent } from '@/lib/api'

interface IEditUser {
    id: string;
    name: string;
    email: string;
    parent: string;
}

const formSchema = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    parent: z.string().optional(),
})

export function EditStudent(props: IEditUser) {

    const [editing, setEditing] = useState(false)

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: props.id,
            name: props.name,
            email: props.email,
            parent: props.parent,
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {

        console.log(values)
        
        try {
              setEditing(editing);
              await editStudent(values);
        } catch (error) {
            console.log(error)
        } finally {
            setEditing(!editing)
        }
    }

  return (
    <React.Fragment>
        <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="h-auto">
                        <div className="grid gap-7 grid-cols-4 mt-5">
                            <div className="col-span-4 gap-4">
                                <div className="flex flex-col gap-3">
                                    <CardTitle className="text-left text-[13px]">Nome</CardTitle>
                                    <div className="flex justify-between gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    {/* <FormLabel className="text-muted-foreground text-[13px]">Pequeno-almoço</FormLabel> */}
                                                    <FormControl>
                                                        <Input placeholder={props.name} {...field} className="text-[13px]" />
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
                                                        <Input placeholder={props.email} {...field} className="text-[13px]" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                    </div>

                                    <CardTitle className="text-left text-[13px]">Parente</CardTitle>
                                    <div className="flex justify-between gap-4">
                                        <FormField
                                            control={form.control}
                                            name="parent"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormControl>
                                                        <Input placeholder={props.parent} {...field} className="text-[13px]" />
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
                        <Button type="submit">Guardar</Button>
                    {/* </SheetClose>
                </SheetFooter> */}
                </form>
                </Form>
    </React.Fragment>
  )
}