"use client"

import React, { useState, useEffect } from "react"

import { useMediaQuery } from "@react-hook/media-query"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { getStudents } from "@/lib/api"

type Status = {
    value: string
    label: string
}

const statuses: Status[] = [
    {
        value: "backlog",
        label: "Backlog",
    },
    {
        value: "todo",
        label: "Todo",
    },
    {
        value: "in progress",
        label: "In Progress",
    },
    {
        value: "done",
        label: "Done",
    },
    {
        value: "canceled",
        label: "Canceled",
    },
]


type Student = {
    id: string,
    name: string,
    parent: string,
    email: string,
    created_at: string,
    year: number,
    class: string
}

interface IGetStudents {
    permLevel: string
}

export default function GetStudent(props: IGetStudents) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<Student[]>([])
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(
        null
    )

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const response = await getStudents();
                const { data } = await response?.json();
                setData(data);

                console.log(data)
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []);


    if (isDesktop) {
        return (
            <React.Fragment>
                <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[200px] justify-start">
                        {selectedStudent ? <>{selectedStudent.name}</>
                            : <div className="flex items-center gap-2"><i className="ri-search-line"></i>Pesquisar</div>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                    <StudentsList setOpen={setOpen} setSelectedStudent={setSelectedStudent} />
                </PopoverContent>
            </Popover>
            {printUserInfo()}
            </React.Fragment>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                    {selectedStudent ? <>{selectedStudent.name}</> : <>+ Set status</>}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mt-4 border-t">
                    <StudentsList setOpen={setOpen} setSelectedStudent={setSelectedStudent} />
                </div>
            </DrawerContent>
        </Drawer>
    )



    function StudentsList({
        setOpen,
        setSelectedStudent,
    }: {
        setOpen: (open: boolean) => void
        setSelectedStudent: (student: Student | null) => void
    }) {
        return (
            <Command>
                <CommandInput
                 placeholder="Digite o nome" />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                        {data.map((student) => (
                            <CommandItem
                                key={student.id}
                                value={student.name}
                                onSelect={(value) => {
                                    setSelectedStudent(
                                        data.find((priority) => priority.name === value) || null
                                    )
                                    setOpen(false)
                                }}
                            >
                                {student.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </Command>
        )
    }

    function printUserInfo() {
        return (
            <div className="user-info">
                    {
                        selectedStudent ? (
                            <p>{selectedStudent.name}</p>
                        ) : <p>Ninguém foi seleccionado</p>
                    }
            </div>
        )
    }
}




// "use client"

// import { getStudents } from '@/lib/api';
// import React, { useState } from 'react'
// import {
//     Table,
//     TableBody,
//     TableCaption,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table"

// import {
//     Dialog,
//     DialogTrigger,
// } from "@/components/ui/dialog"

// import Report from "@/components/report";
// import { Button } from "@/components/ui/button";
// import DeleteAction from "@/components/delete-action";
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"

// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormMessage,
// } from "@/components/ui/form"

// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import { CardTitle } from "./ui/card"
// import { useMediaQuery } from "@react-hook/media-query"
// import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerTrigger } from './ui/drawer';



// const formSchema = z.object({
//     turma: z.string().min(2).max(2),
// })

// // Definindo uma interface para o tipo dos dados
// interface IDataItem {
//     id: string;
//     created_at: string;
//     name: string;
//     year: number;
//     class: string;
//     email: string;
//     parent: string;
// }

// interface IGetStudents {
//     permLevel: string
// }

// const GetStudent = (props: IGetStudents) => {

//     // const [dados, setData] = useState([]);
//     const [loading, setLoading] = useState<boolean>(false);
//     const isDesktop = useMediaQuery("(min-width: 768px)")

//     const [students, setStudents] = useState<IDataItem[]>([])
//     const [state, setState] = useState({
//         turma: ""
//     })

//     // Função para adicionar um novo aluno
//     const newStudent = async (newStudentData: any) => {
//         try {
//             setLoading(true);
//             setStudents((prevStudents) => [...prevStudents, newStudentData]);
//         } catch (error) {
//             console.error('Error adding student:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // const dataHandler = async (values: []) => {}

//     //   useEffect(() => {
//     //     const getData = async () => {
//     //         setLoading(true);
//     //       try {
//     //         const response = await getStudents();
//     //         const responseData = await response.data;
//     //         setData(responseData);

//     //         console.log(response.data)
//     //       } catch (error) {
//     //         console.error('Error fetching data:', error);
//     //       } finally {
//     //         setLoading(false);
//     //       }
//     //     };

//     //     getData();
//     //   }, []);

//     // Modificando um dos estados
//     const updateField = (field: any, value: any) => {
//         setState((prevState) => ({
//             ...prevState,
//             [field]: value,
//         }));
//     };


//     // 1. Define form.
//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             turma: "",
//         },
//     })

//     async function dataHandler(values: any) {

//         // Armazena os dados em um estado para renderizar
//         setStudents(values)
//         JSON.stringify(students, null, 2);
//     }
//     // 2. Define a submit handler.
//     async function onSubmit(values: z.infer<typeof formSchema>) {
//         try {
//             setLoading(true);
//             const response = await getStudents(values);
//             const { data } = await response?.json();
//             await dataHandler(data)

//         } catch (error) {
//             console.error('Error fetching data:', error);
//         } finally {
//             setLoading(false);
//         }
//     }


//     return (
//         <React.Fragment>
//             <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 flex items-end gap-4">
//                     <div className='w-full md:w-auto'>
//                         <FormField
//                             control={form.control}
//                             name="turma"
//                             render={({ field }) => (
//                                 <FormItem className="md:min-w-[140px]">
//                                     <CardTitle className="text-[16px] mt-3">Filtro</CardTitle>
//                                     <Select
//                                         //  defaultValue={field.value}
//                                         onValueChange={(e) => {
//                                             field.onChange(e);  // Chama o onChange original do field
//                                             updateField('turma', e);  // Chama a função que actualiza o estado
//                                         }} >
//                                         <FormControl>
//                                             <SelectTrigger className="w-full text-[13px]">
//                                                 <SelectValue placeholder="" {...field} />
//                                             </SelectTrigger>
//                                         </FormControl>
//                                         <SelectContent>
//                                             <SelectItem className="text-[13px]" value="T1">T1</SelectItem>
//                                             <SelectItem className="text-[13px]" value="T2">T2</SelectItem>
//                                             <SelectItem className="text-[13px]" value="T3">T3</SelectItem>
//                                             <SelectItem className="text-[13px]" value="T4">T4</SelectItem>
//                                             <SelectItem className="text-[13px]" value="T5">T5</SelectItem>
//                                             <SelectItem className="text-[13px]" value="T6">T6</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                     <FormMessage />
//                                 </FormItem>
//                             )} />
//                     </div>

//                     <Button type="submit" className="text-[12px]">
//                         <i className="ri-equalizer-2-line mr-2"></i>
//                         Filtrar
//                     </Button>
//                 </form>
//             </Form>


//             {loading ?
//                 <div className='w-full h-full flex justify-center items-center pt-10 mt-10'><i className="ri-loader-line animate-spin text-[16px]"></i></div>
//                 :
//                 students.length > 0
//                     ? (
//                         <Table className="mt-5 rounded-sm text-[13px]">
//                             {/* <TableCaption>Lista dos alunos da turma {state.turma}.</TableCaption> */}
//                             <TableHeader className="bg-zinc-200/50 border border-zinc-200">
//                                 <TableRow>
//                                     <TableHead className="w-[140px] font-bold">Código</TableHead>
//                                     <TableHead className="font-bold">Nome</TableHead>
//                                     {/* <TableHead className="font-bold">Ano</TableHead> */}
//                                     {/* <TableHead className="font-bold">Turma</TableHead> */}
//                                     <TableHead className="font-bold">Parente</TableHead>
//                                     <TableHead className="font-bold">E-mail</TableHead>
//                                     {props.permLevel === 'admin' ? <TableHead className="w-[60px] font-bold">Ação</TableHead> : ''}
//                                 </TableRow>
//                             </TableHeader>

//                             <TableBody className="border border-zinc-200">
//                                 {students.map((aluno: any, index: any) => (
//                                     <TableRow key={index}>
//                                         <TableCell className="max-w-[140px] font-medium text-nowrap overflow-hidden text-ellipsis">{aluno.id}</TableCell>
//                                         <TableCell>

//                                             {isDesktop
//                                                 ?
//                                                 (
//                                                     <Dialog>
//                                                     <DialogTrigger className="hover:cursor-pointer hover:text-blue-500 hover:underline">
//                                                         {aluno.name}
//                                                     </DialogTrigger>

//                                                     <Report
//                                                         id={aluno.id}
//                                                         name={aluno.name}
//                                                         year={aluno.year}
//                                                         class={aluno.class}
//                                                         email={aluno.email} />
//                                                 </Dialog>
//                                                 )
//                                                 :
//                                                 (
//                                                     <Drawer>
//                                                     <DrawerTrigger asChild className="hover:cursor-pointer hover:text-blue-500 hover:underline">
//                                                         <Button
//                                                             variant="link"
//                                                             className="text-[13px]"
//                                                         >
//                                                             {aluno.name}
//                                                         </Button>
//                                                     </DrawerTrigger>
//                                                     <Report
//                                                         id={aluno.id}
//                                                         name={aluno.name}
//                                                         year={aluno.year}
//                                                         class={aluno.class}
//                                                         email={aluno.email} />
//                                                 </Drawer>
//                                                 )
//                                             }

//                                         </TableCell>
//                                         {/* <TableCell>{aluno.year}</TableCell> */}
//                                         {/* <TableCell>{aluno.class}</TableCell> */}
//                                         <TableCell>{aluno.parent}</TableCell>
//                                         <TableCell>{aluno.email}</TableCell>
//                                         {props.permLevel === 'admin' ?
//                                             <TableCell className="flex items-center gap-6 pr-4">
//                                                 <DeleteAction id={aluno.id} name={aluno.name} class={aluno.class} />
//                                             </TableCell>
//                                             : ""
//                                         }
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     )
//                     :
//                     (
//                         <div className='w-full h-full flex flex-col justify-center items-center pt-10 mt-10'>
//                             <i className="ri-inbox-2-line text-[40px] text-muted-foreground"></i>
//                             <span className='text-[14px] text-muted-foreground'>Não existem alunos nesta turma.</span>
//                         </div>
//                     )}
//         </React.Fragment>
//     )
// }

// export default GetStudent