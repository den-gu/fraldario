"use client"

import React, { useState } from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { addMeal } from "@/lib/api"
import { AddMeal } from "./add-meal"
import { AddStudent } from "./add-student"
import { AddMessage } from "./add-message"


const formSchema = z.object({
    lanche: z.string().optional(),
})

export function Create() {

    const [isSubmitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)

    const loadHandler = (state: boolean) => {
        setLoading(!state)
    }

    const sendingHandler = (state: boolean) => {
        setSubmitting(!state)
        setTimeout(() => {
            toast('Sucesso', {
                description: 'A refeição do dia foi adicionada.',
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
            lanche: "",
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


    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline"
                    className="hidden sm:flex items-center text-[14px]"
                >
                    {/* <i className="ri-restaurant-line mr-2 text-[15px]"></i> */}
                    {/* <i className="ri-add-line text-[14px] font-thin"></i> */}
                    Adicionar
                </Button>
            </SheetTrigger>
            <SheetContent className="min-w-full md:min-w-[500px] overflow-y-scroll">
                <SheetHeader>
                    <SheetTitle>Adicionar</SheetTitle>
                    {/* <SheetDescription>
                        Escreva mensagens, adicione alunos e a refeição do dia.
                    </SheetDescription> */}
                </SheetHeader>

                <Tabs defaultValue="report" className="mt-4">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="report">Refeição</TabsTrigger>
                        <TabsTrigger value="student">Aluno</TabsTrigger>
                        <TabsTrigger value="message">Mensagem</TabsTrigger>
                    </TabsList>
                    <TabsContent value="report" className="mt-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>Refeição</CardTitle>
                                {/* <CardDescription>
              Make changes to your account here. Click save when you are done.
            </CardDescription> */}
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <AddMeal />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="student" className="mt-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>Aluno</CardTitle>
                                {/* <CardDescription>
              Change your password here. After saving, you will be logged out.
            </CardDescription> */}
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <AddStudent />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="message" className="mt-5">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mensagem</CardTitle>
                                {/* <CardDescription>
              Change your password here. After saving, you will be logged out.
            </CardDescription> */}
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <AddMessage />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    )
}