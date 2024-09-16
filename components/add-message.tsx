import React, { useEffect, useRef, useState } from 'react';

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
import { addStudent, getStudents, sendMessage } from "@/lib/api"
import { Toaster, toast } from 'sonner';
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
// import { mailOptions, transporter } from '@/config/nodemailer'
// import { getStudents } from '@/lib/api';
// import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/client'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { supabase } from '@/lib/supabaseClient';
import { Checkbox } from './ui/checkbox';


type Student = {
  id: string | undefined;
  name: string | undefined;
  email: string;
}

type Receptor = {
  email: string;
}

const formSchema = z.object({
  subject: z.string().min(2),
  message: z.string().min(2),
})

export default function AddMessage() {
  const [isSubmitting, setSubmitting] = useState(false)
  const [attachment, setAttachment] = useState(null);
  const [btnText, setBtnText] = useState('Submit');
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(
    null
  )
  const [students, setStudents] = useState<Student[]>([])
  // const [uploadedFile, setUploadedFile] = useState('');

  const fileInput = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);


  const { control, handleSubmit, watch, setValue } = useForm();
  const [receptors, setReceptors] = useState<string[]>([]);

  const handleCheckboxChange = (email: string, checked: any) => {
    setReceptors(prevSelected =>
      checked
        ? [...prevSelected, email]
        : prevSelected.filter(e => e !== email)
    );
  };

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
      message: "",
    },
  })


  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await getStudents();
        const { data } = await response?.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {

    const supabase = createClient();
    const bucket = 'fraldario';
    const newReceptors = receptors; // Use os e-mails dos alunos selecionados

    try {
      submitHandler(isSubmitting)
      let fileName = "";

      if (fileInput.current?.files?.length) {
        const file = fileInput.current.files[0];
        fileName = file.name;

        const fileExtension = fileName.split('.').pop(); // Extrai a extensão
        console.log(`Nome do arquivo: ${fileName}`);
        console.log(`Extensão do arquivo: ${fileExtension}`);

        const formData = new FormData();
        formData.append("file", file);

        const filePath = `${fileName}`;
        // Upload the file
        const { data, error } = await supabase
          .storage
          .from(bucket)
          .upload(filePath, file);

        console.log(fileName)

        if (error) {
          console.error('Error uploading file:', error);
        }


        // Generate the public URL
        const { data: { publicUrl } } = supabase
          .storage
          .from(bucket)
          .getPublicUrl(filePath);

          console.log('File URL:', publicUrl);

          console.log(values)
          console.log(data)

        await sendMessage(values, newReceptors, fileName, publicUrl)
      } else {
        await sendMessage(values, newReceptors)
        console.log("Nenhum arquivo selecionado.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  function handleFileChange() {
    const file = fileInput.current?.files?.[0];
    if (file) {
      setUploadedFile(file.name); // Atualiza o estado com o nome do arquivo
    } else {
      setUploadedFile(""); // Limpa o estado se nenhum arquivo for selecionado
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-auto" encType="multipart/form-data">
      <div className="flex flex-col mb-4 gap-2">
        <span className='text-sm'>Para: {receptors.length > 0 ? `${receptors[0]} ${receptors.length > 1 ? `+ ${receptors.length - 1}` : ''}` : 'Todos'}</span>
        <div className=''>
          {/* <SendTo/> */}
      {isDesktop ? (
        <div>
        <Popover open={open} onOpenChange={setOpen}>
          <div className="flex items-center relative">
            <PopoverTrigger asChild className="cursor-text">
              <Button variant="secondary" className="w-full justify-start">
                <div className="flex items-center gap-2 text-[13px]">
                  <i className="ri-search-line text-[16px]"></i>
                  {selectedStudent ? selectedStudent.name : 'Selecionar'}
                </div>
              </Button>
            </PopoverTrigger>
            {selectedStudent ?
              <Button variant="secondary" onClick={() => setSelectedStudent(null)} className="text-[16px] absolute right-0 shadow-none">
                <div className="flex items-center gap-2"><i className="ri-close-circle-line"></i></div>
              </Button> : ''}
          </div>
          <PopoverContent className="w-[200px] p-0" align="start">
            <StudentList setOpen={setOpen} setSelectedStudent={setSelectedStudent} />
          </PopoverContent>
        </Popover>
        {/* <StudentData></StudentData> */}
      </div>
    ) : (
    <div>
      <Drawer open={open} onOpenChange={setOpen}>
        <div className="flex items-center relative">
          <DrawerTrigger asChild className="cursor-text">
            <Button variant="outline" className="w-full justify-start">
              <div className="flex items-center gap-2 text-[13px]">
                <i className="ri-search-line text-[16px]"></i>
                {selectedStudent ? selectedStudent.name : 'Selecionar'}
              </div>
            </Button>
          </DrawerTrigger>
          {selectedStudent ?
            <Button variant="outline" onClick={() => setSelectedStudent(null)} className="text-[16px] absolute right-0 shadow-none border-l-0 rounded-tl-none rounded-bl-none">
              <div className="flex items-center gap-2"><i className="ri-close-circle-line"></i></div>
            </Button> : ''}
        </div>
        <DrawerContent>
          <div className="mt-4 border-t">
            <StudentList setOpen={setOpen} setSelectedStudent={setSelectedStudent} />
          </div>
        </DrawerContent>
      </Drawer>

      {/* <StudentData></StudentData> */}
    </div>
  )}
        </div>
      </div>
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
        {uploadedFile !== "" && uploadedFile !== null ? (
          <p className='mt-2 text-sm'>Anexo: {uploadedFile}</p>
        ) : ""}
        <div className="flex w-full max-w-sm items-center gap-1.5 mt-4">
          <Button type="submit" disabled={isSubmitting} className="w-full md:w-fit flex items-center">
            {isSubmitting ? <i className="ri-loader-line animate-spin text-[14px]"></i> : `Enviar`}
          </Button>
          <Label htmlFor="attachment" className="p-2 hover:cursor-pointer hover:bg-slate-100/80 rounded-md">
            <i className="ri-attachment-line text-[20px]"></i>
          </Label>
          <Input
            id="attachment"
            name="attachment"
            type="file"
            ref={fileInput}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </form>
    </Form>
  )

function SendTo({ className }: React.ComponentProps<"form">) {

  // const [open, setOpen] = useState(false)
  // const [loading, setLoading] = useState(false)
  // const [isLoading, setIsLoading] = useState(false)
  // const [deleting, setDeleting] = useState(false)
  // const [saving, setSaving] = useState(false)
  // const [students, setStudents] = useState<Student[]>([])
  const isDesktop = useMediaQuery("(min-width: 768px)")
  // const [selectedStudent, setSelectedStudent] = useState<Student | null>(
  //   null
  // )
  // const [lastMeal, setLastMeal] = useState<Meal | null>(null);

  if (isDesktop) {
    return (
      <div>
        <Popover open={open} onOpenChange={setOpen}>
          <div className="flex items-center relative z-50">
            <PopoverTrigger asChild className="flex-1 cursor-text">
              <Button variant="secondary" className="w-full justify-start">
                <div className="flex items-center gap-2 text-[13px]">
                  <i className="ri-search-line text-[16px]"></i>
                  {selectedStudent ? selectedStudent.name : 'Pesquisar'}
                </div>
              </Button>
            </PopoverTrigger>
            {selectedStudent ?
              <Button variant="secondary" onClick={() => setSelectedStudent(null)} className="text-[16px] absolute right-0 shadow-none">
                <div className="flex items-center gap-2"><i className="ri-close-circle-line"></i></div>
              </Button> : ''}
          </div>
          <PopoverContent className="w-[200px] p-0" align="start">
            <StudentList setOpen={setOpen} setSelectedStudent={setSelectedStudent} />
          </PopoverContent>
        </Popover>
        {/* <StudentData></StudentData> */}
      </div>
    )
  }

  return (
    <div>
      <Drawer open={open} onOpenChange={setOpen}>
        <div className="flex items-center relative">
          <DrawerTrigger asChild className="cursor-text">
            <Button variant="outline" className="w-full justify-start">
              <div className="flex items-center gap-2 text-[13px]">
                <i className="ri-search-line text-[16px]"></i>
                {selectedStudent ? selectedStudent.name : 'Pesquisar'}
              </div>
            </Button>
          </DrawerTrigger>
          {selectedStudent ?
            <Button variant="outline" onClick={() => setSelectedStudent(null)} className="text-[16px] absolute right-0 shadow-none border-l-0 rounded-tl-none rounded-bl-none">
              <div className="flex items-center gap-2"><i className="ri-close-circle-line"></i></div>
            </Button> : ''}
        </div>
        <DrawerContent>
          <div className="mt-4 border-t">
            <StudentList setOpen={setOpen} setSelectedStudent={setSelectedStudent} />
          </div>
        </DrawerContent>
      </Drawer>

      {/* <StudentData></StudentData> */}
    </div>
  )
}


function StudentList({
  setOpen,
  setSelectedStudent,
}: {
  setOpen: (open: boolean) => void
  setSelectedStudent: (student: Student | null) => void
}) {
  return (
    <Command className="w-full">
      {/* <CommandInput className="w-full" placeholder="Digite o nome..." /> */}
      <CommandList>
        <CommandGroup>
          {students
            ? students.map((student) => (
              <div key={student.id} className='flex items-center gap-2 mb-1'>
                <Checkbox
                  value={student.email}
                  id={student.id}
                  checked={receptors.includes(student.email)}
                  onCheckedChange={(checked) => handleCheckboxChange(student.email, checked)}
                />
                      <FormLabel htmlFor={student.id} className="font-normal cursor-pointer w-full">
                          {student.name}
                        </FormLabel>
                      <FormMessage />
              </div>
            ))
            : <i className="ri-loader-line animate-spin text-[14px]"></i>}
        </CommandGroup>
      </CommandList>
    </Command>
  )
  }
}