"use client"

import { getStudents } from '@/lib/api';
import React, { useState, useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog"

import Report from "@/components/report";
import { Button } from "@/components/ui/button";
import DeleteAction from "@/components/delete-action";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
    turma: z.string().min(2).max(50),
})

// Definindo uma interface para o tipo dos dados
interface IDataItem {
    id: string;
    created_at: string;
    name: string;
    year: number;
    class: string;
    email: string;
    parent: string;
}

interface IGetStudents {
    permLevel: string
}

const GetStudents = (props: IGetStudents) => {

    // const [dados, setData] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [students, setStudents] = useState([])
    const [state, setState] = useState({
        turma: ""
    })

    // const dataHandler = async (values: []) => {}

    //   useEffect(() => {
    //     const getData = async () => {
    //         setLoading(true);
    //       try {
    //         const response = await getStudents();
    //         const responseData = await response.data;
    //         setData(responseData);

    //         console.log(response.data)
    //       } catch (error) {
    //         console.error('Error fetching data:', error);
    //       } finally {
    //         setLoading(false);
    //       }
    //     };

    //     getData();
    //   }, []);

    // Modificando um dos estados
    const updateField = (field: any, value: any) => {
        setState((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };


    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            turma: "",
        },
    })

    async function dataHandler(values: any) {
         // Recebe diretamente os dados dos alunos
        // setData(values); // Armazena os dados em um estado para renderizar
        setStudents(values)
        JSON.stringify(students, null, 2);
    }
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true);
            const response = await getStudents(values);
            const { data } = await response?.json();

            // const query = JSON.stringify(response, null, 2);
            await dataHandler(data)

            // console.log("Students:", students);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }


    return (
        <React.Fragment>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 flex items-end gap-4">
                    <div>
                        <FormField
                            control={form.control}
                            name="turma"
                            render={({ field }) => (
                                <FormItem className="min-w-[140px]">
                                    <CardTitle className="text-[13px] mt-3">Turma</CardTitle>
                                    <Select
                                        //  defaultValue={field.value}
                                        onValueChange={(e) => {
                                            field.onChange(e);  // Chama o onChange original do field
                                            updateField('turma', e);  // Chama a função que actualiza o estado
                                        }} >
                                        <FormControl>
                                            <SelectTrigger className="w-full text-[13px]">
                                                <SelectValue placeholder="" {...field} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem className="text-[13px]" value="T1">T1</SelectItem>
                                            <SelectItem className="text-[13px]" value="T2">T2</SelectItem>
                                            <SelectItem className="text-[13px]" value="T3">T3</SelectItem>
                                            <SelectItem className="text-[13px]" value="T4">T4</SelectItem>
                                            <SelectItem className="text-[13px]" value="T5">T5</SelectItem>
                                            <SelectItem className="text-[13px]" value="T6">T6</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                    </div>

                    <Button type="submit" className="text-[12px]">
                        <i className="ri-equalizer-2-line mr-2"></i>
                        Filtrar
                    </Button>
                </form>
            </Form>


            {loading ?
                <div className='w-full h-full flex justify-center items-center pt-10 mt-10'><i className="ri-loader-line animate-spin text-[16px]"></i></div>
                : 
                students.length > 0 
                        ? (
                            <Table className="mt-5 rounded-sm text-[13px]">
                                {/* <TableCaption>A list of your recent alunos.</TableCaption> */}
                                <TableHeader className="bg-zinc-200/50 border border-zinc-200">
                                    <TableRow>
                                        <TableHead className="w-[140px] font-bold">Código</TableHead>
                                        <TableHead className="font-bold">Nome</TableHead>
                                        <TableHead className="font-bold">Ano</TableHead>
                                        <TableHead className="font-bold">Turma</TableHead>
                                        <TableHead className="font-bold">Parente</TableHead>
                                        <TableHead className="font-bold">E-mail</TableHead>
                                        {props.permLevel === 'admin' ? <TableHead className="w-[60px] font-bold">Ação</TableHead> : ''}
                                    </TableRow>
                                </TableHeader>
                             
                            <TableBody className="border border-zinc-200">
                            {students.map((aluno: any , index: any) => (
                                <TableRow key={index}>
                                <TableCell className="max-w-[140px] font-medium text-nowrap overflow-hidden text-ellipsis">{aluno.id}</TableCell>
                                <TableCell>
                                    <Dialog>
                                        <DialogTrigger className="hover:cursor-pointer hover:text-blue-500 hover:underline">
                                            {aluno.name}
                                        </DialogTrigger>
    
                                        <Report
                                            id={aluno.id}
                                            name={aluno.name}
                                            year={aluno.year}
                                            class={aluno.class}
                                            email={aluno.email} />
    
                                    </Dialog>
                                </TableCell>
                                <TableCell>{aluno.year}</TableCell>
                                <TableCell>{aluno.class}</TableCell>
                                <TableCell>{aluno.parent}</TableCell>
                                <TableCell>{aluno.email}</TableCell>
                                {props.permLevel === 'admin' ?
                                    <TableCell className="flex items-center gap-6 pr-4">
                                        {/* <Button type="button" className="text-[12px] p-0 h-auto border-0 shadow-none bg-transparent hover:bg-transparent hover:underline" variant="outline">
                       Editar
                     </Button> */}
                                        <DeleteAction alunoID={aluno.id} />
                                    </TableCell>
                                    : ""
                                }
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                        )
                        : 
                        (

                            <div className='w-full h-full flex flex-col justify-center items-center pt-10 mt-10'>
                                <i className="ri-inbox-2-line text-[40px] text-muted-foreground"></i>
                                <span className='text-[14px] text-muted-foreground'>Não existem alunos nesta turma.</span>
                            </div>
                        )}
        </React.Fragment>
    )
}

export default GetStudents