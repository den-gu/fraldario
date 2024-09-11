import React, { useRef, useState } from 'react';
 
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
import { Label } from "./ui/label"


const formSchema = z.object({
  subject: z.string().min(2),
  message: z.string().min(2),
})

export default function AddMessage() {
  const [isSubmitting, setSubmitting] = useState(false)
  const [attachment, setAttachment] = useState(null);
  const [btnText, setBtnText] = useState('Submit');
  // const [uploadedFile, setUploadedFile] = useState('');

  const fileInput = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

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

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {

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
    
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
    
          const result = await response.json();
          console.log(result);
        } else {
          console.log("Nenhum arquivo selecionado.");
        }

        await sendMessage(values, fileName)
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

  // return (
  //   <form className="flex flex-col gap-4">
  //     <label>
  //       <input type="text" name="subject" id="subject" placeholder="Assunto: " />
  //       <input type="text" name="message" id="message" placeholder="Message: " />
  //       <span>Upload a file</span>
  //       <input type="file" name="file" ref={fileInput} />
  //     </label>
  //     <button type="submit" onClick={uploadFile}>
  //       Submit
  //     </button>
  //   </form>
  // );
  return (
    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="h-auto" encType="multipart/form-data">
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
                            {isSubmitting ? <i className="ri-loader-line animate-spin text-[14px]"></i> : `Enviar` }
                        </Button>
      <Label htmlFor="attachment" className="p-2 hover:cursor-pointer hover:bg-slate-100/80 rounded-md">
      <i className="ri-attachment-line text-[20px]"></i>
      </Label>
      {/* <FormLabel className="text-[12px]">Anexo</FormLabel> */}
      {/* <Input id="attachment"
       name='attachment' type="file" ref={fileInput} className='hidden'
       onChange={() => setUploadedFile(fileName)} /> */}
       <Input 
          id="attachment"
          name="attachment"
          type="file"
          ref={fileInput}
          className="hidden"
          onChange={handleFileChange} // Aciona a função quando o arquivo é selecionado
        />
    </div>
                </form>
                </Form>
  )
}
