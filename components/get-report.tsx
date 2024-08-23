"use client"

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
// import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient";
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { sendReport } from "@/lib/api"
import { CardTitle } from "./ui/card"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Report } from "./report";

type Report = {
  id: string;
  created_at: string;
  student_name: string,
  behavior: string,
  pequenoAlmoco: string,
  almoco1: string,
  almoco2: string,
  sobremesa: string,
  lanche: string,
  extras1: string,
  extras2: string,
  porcaoPequenoAlmoco: string,
  porcaoAlmoco1: string,
  porcaoAlmoco2: string,
  porcaoSobremesa: string,
  porcaoLanche: string,
  porcaoExtras1: string,
  porcaoExtras2: string,
  fezes: string,
  fezesNr: string,
  vomitos: string,
  vomitosNr: string,
  febres: string,
  message: string,
  email?: string,
}


const FormSchema = z.object({
  reportDate: z.date({
    required_error: "Data do relatório é obrigatória.",
  }),
})


const GetReport: React.FC = () => {

  let i = 0;
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [downloadAll, setDownloadAll] = useState(false)
  const [isSendingEmail, setSending] = useState(false)
  const [reports, setReports] = useState<any[]>([])


  const sendingHandler = (state: boolean, email: string) => {
    setSending(!state)
    setTimeout(() => {
      toast('Sucesso', {
        description: `E-mail enviado para ${email}.`,
        duration: 12000,
        cancel: {
          label: 'Fechar',
          onClick: () => console.log('Cancel!'),
        },
      })
      setSending(state)
    }, 2000);
  }

  //   useEffect(() => {
  //     const getData = async () => {
  //         setLoading(true);
  //         try {
  //             const response = await getReports();
  //             const { data } = await response?.json();
  //             setData(data);
  //         } catch (error) {
  //             console.error('Error fetching data:', error);
  //         } finally {
  //             setLoading(false);
  //         }
  //     };
  //     getData();
  // }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(values: z.infer<typeof FormSchema>) {

    setLoading(true);

    const formDate = new Intl.DateTimeFormat('pt-BR').format(values.reportDate);

    const fetchReportsByDate = async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq("createdAtIntDTF", formDate)
        .order('student_name', { ascending: true });

      if (error) {
        toast('Ops... Algo deu errado', {
          description: 'Não foi possível efectuar a operação.',
          duration: 12000,
          cancel: {
            label: 'Fechar',
            onClick: () => console.log('Cancel!'),
          },
        })
      } else {
        setReports(data);
      }

      setLoading(false);
    };

    fetchReportsByDate()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex items-center gap-4 mt-2">
        <FormField
          control={form.control}
          name="reportDate"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Escolha uma data</span>
                      )}
                      {/* <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> */}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Pesquisar</Button>
      </form>
      {loading
        ? <div className="flex justify-center items-center mt-20">
          <i className="ri-loader-line animate-spin text-[14px]"></i>
        </div>
        : reports.length !== 0
          ? <div>
          <div className="flex items-center gap-5 mt-4">
            <b className="text-muted-foreground">Total: {reports.length}</b>
            <Button variant="link" onClick={() => downloadAllReports()} disabled={downloadAll} className="text-blue-400 text-[13px] h-0 py-0 px-2">
            {downloadAll ? (
              <i className="ri-loader-line animate-spin text-[14px]"></i>
            )
              : (
                <>
                  <i className="ri-download-line mr-1 text-[13px]"></i> Baixar
                </>
              )}
          </Button>
          </div>
            <Table className="rounded-sm mt-3">
            {

            }
            {/* JSON.stringify(reports, null) */}
            {/* <TableCaption>A list of your recent alunos.</TableCaption> */}
            <TableHeader className="bg-zinc-200/50 border border-zinc-200 text-[13px]">
              <TableRow>
                {/* <TableHead className="w-[100px]">Código</TableHead> */}
                <TableHead className="max-w-14"># ID</TableHead>
                <TableHead>Nome</TableHead>
                {/* <TableHead>E-mail</TableHead> */}
                <TableHead>Hora</TableHead>
                <TableHead>Data do relatório</TableHead>
                <TableHead>Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border border-zinc-200 text-[13px]">
              {reports.map((data: any) => (
                <TableRow key={data.id.slice(0, 5)}>
                  <TableCell className="font-medium max-w-14 overflow-hidden text-nowrap text-ellipsis">
                    {data.id.slice(0, 5)}
                  </TableCell>
                  {/* <TableCell>{data.id}</TableCell> */}
                  <TableCell>{data.student_name}</TableCell>
                  {/* <TableCell>{data.email}</TableCell> */}
                  <TableCell>
                  {
                    extractTime(data.created_at)
                  }
                  </TableCell>
                  <TableCell>{data.createdAtIntDTF}</TableCell>
                  <TableCell className="text-left p-0 flex items-center gap-1">
                    <Dialog>
                      <DialogTrigger className="flex items-center text-blue-400 text-[13px] px-2 hover:underline">
                        <i className="ri-eye-line mr-1 text-[13px]"></i>
                        Ver
                      </DialogTrigger>
                      <DialogContent className="w-full lg:min-w-[650px] px-0 pt-8">
                        {/* <DialogHeader>
                          <DialogTitle className="border-b border-zinc-200 px-6 pb-3">O Fraldario</DialogTitle>
                        </DialogHeader> */}
                        <StudentData
                          student_name={data.student_name} behavior={data.behavior}
                          email={data.email} id={data.id} created_at={data.created_at}
                          pequenoAlmoco={data.pequeno_almoco} porcaoPequenoAlmoco={data.porcao_pequeno_almoco}
                          almoco1={data.almoco1} porcaoAlmoco1={data.porcao_almoco1} almoco2={data.porcao_almoco2}
                          porcaoAlmoco2={data.porcao_almoco2} sobremesa={data.sobremesa} porcaoSobremesa={data.porcao_sobremesa}
                          lanche={data.lanche} porcaoLanche={data.porcao_lanche} extras1={data.extras1} porcaoExtras1={data.porcao_extras1}
                          extras2={data.extras2} porcaoExtras2={data.porcao_extras2} fezes={data.fezes}
                          vomitos={data.vomitos} febres={data.febres} message={data.message} fezesNr={data.nr_fezes} vomitosNr={data.nr_vomitos} />
                      </DialogContent>
                    </Dialog>
                    {/* <Button variant="link" className="flex items-center text-blue-400 text-[13px] px-2">
                      <i className="ri-eye-line mr-1 text-[13px]"></i>
                      Ver
                    </Button> */}
                    <Button variant="link" onClick={() => downloadReport(data)} disabled={downloading} className="flex items-center text-blue-400 text-[13px] px-2">
                      {downloading ? (
                        <i className="ri-loader-line animate-spin text-[14px]"></i>
                      )
                        : (
                          <>
                            <i className="ri-download-line mr-1 text-[13px]"></i>
                            Baixar
                          </>
                        )}
                    </Button>
                    <Button variant="link" onClick={() => sendEmail(data)} disabled={isSendingEmail} className="flex items-center text-blue-400 text-[13px] px-2">
                      {isSendingEmail ? (
                        <i className="ri-loader-line animate-spin text-[14px]"></i>
                      )
                        : (
                          <>
                            <i className="ri-mail-send-line mr-1 text-[13px]"></i>
                            Enviar
                          </>
                        )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
          </Table>
          </div>
          : <div className="flex justify-center items-center mt-20">
            <p className="text-muted-foreground">Dados não encontrados. Tente seleccionar uma data diferente.</p>
          </div>}
    </Form>
  )



  async function sendEmail(data: any) {
    // 2. Define a submit handler.
    try {
      sendingHandler(isSendingEmail, data.email);
      await sendReport(data);
      // await saveReport(values);
    } catch (error) {
      console.log(error)
    }
  }

  
  function downloadAllReports(
    values?: any
  ) {

    setDownloadAll(true)

    const doc = new jsPDF('l');
    let date: string;
    let image = new Image();

    image.src = 'https://i.ibb.co/H4Wvchg/ofraldario.webp';

    doc.addImage(image, 'JPG', 14, 8, 50, 0); //base64 image, format, x-coordinate, y-coordinate, width, height
    
    doc.setFontSize(15);
    doc.text('Relatório de Refeições', 75, 18);
    doc.setFontSize(10);
    doc.setTextColor("#666666");
    doc.text(`Data: `, 75, 22);
    
    // doc.text(`Refeição/Porção`, 14, 40);

    autoTable(doc, {
      head: [["Nome", "Comp.", "Peq.almoço", "Extras/m", "1º Almoço", "2º Almoço", "Extras/t", "Sobremesa", "Lanche", "Fezes", "Vômitos", "Febres"]],
        theme: 'grid',
        headStyles: {fillColor : [18, 105, 24]},
        styles: {
          fontSize: 8
        },
        margin: { top: 28, bottom: 0 },
    })

    for(const data of reports) {

      date = data?.createdAtIntDTF;

      // Generate the table
      autoTable(doc, {
        styles: {
          fontSize: 8
        },
        margin: { top: 0, bottom: 0 },
        body: [
          [`${data?.student_name}`, `${data?.behavior}`, `${data?.pequeno_almoco}`, `${data?.extras1}`, `${data?.almoco1}`, `${data?.almoco2}`, `${data?.extras2}`, `${data?.sobremesa}`, `${data?.lanche}`, `${data?.fezes}`, `${data?.vomitos}`, `${data?.febres}`],
          [``, ``, `${data?.porcao_pequeno_almoco}`, `${data?.porcao_extras1}`, `${data?.porcao_almoco1}`, `${data?.porcao_almoco2}`, `${data?.porcao_extras2}`, `${data?.porcao_sobremesa}`, `${data?.porcao_lanche}`, `${data?.nr_fezes > 0 ? data?.nr_fezes + 'x' : ''}`, `${data?.nr_vomitos > 0 ? data?.nr_vomitos + 'x' : ''}`, ``],
        ],
      })
    }

    // doc.text(`Fezes: ${data?.fezes}             Vômitos: ${data?.vomitos}             Febres: ${data?.febres}`, 14, 75); + 10
    // doc.text(`Outras ocorrências: ${data?.message}`, 14, 75);

    setTimeout(async () => {
      setDownloadAll(false);
      // Save the PDF
      doc.save(`Report-${date}.pdf`);
      toast('Sucesso', {
        description: 'O relatório foi descarregado.',
        duration: 12000,
        cancel: {
          label: 'Fechar',
          onClick: () => console.log('Closed!'),
        },
      })
    }, 2000);

    return values;
  }


  function downloadReport(data?: any) {

    setDownloading(true)

    const doc = new jsPDF('l');
    let image = new Image();

    image.src = 'https://i.ibb.co/H4Wvchg/ofraldario.webp';

    doc.addImage(image, 'JPG', 14, 8, 50, 0); //base64 image, format, x-coordinate, y-coordinate, width, height

    doc.setFontSize(15);
    doc.text('Relatório de Refeições', 75, 18);
    doc.setFontSize(10);
    doc.setTextColor("#666666");
    doc.text(`Data: ${data?.createdAtIntDTF}`, 75, 22);
    // doc.text(`Data: ${data?.createdAtIntDTF}`, 190, 25, { align: 'right' });
    // doc.text(`Nome da criança: ${data?.student_name}`, 14, 30);
    // doc.text(`Comportamento: ${data?.behavior}`, 190, 30, { align: 'right' });

    // doc.text(`Refeição/Porção`, 14, 40);

    // Generate the table
    autoTable(doc, {
      head: [["Pequeno-almoço", "Almoço: 1º", "Almoço: 2º", "Sobremesa", "Lanche", "Extras: 1º", "Extras: 2º"]],
      theme: 'striped',
      headStyles: {fillColor : [18, 105, 24]},
      styles: {
        fontSize: 8
      },
      margin: { top: 28 },
      body: [
        [`${data?.pequeno_almoco}`, `${data?.almoco1}`, `${data?.almoco2}`, `${data?.sobremesa}`, `${data?.lanche}`, `${data?.extras1}`, `${data?.extras2}`],
        [`${data?.porcao_pequeno_almoco}`, `${data?.porcao_almoco1}`, `${data?.porcao_almoco2}`, `${data?.porcao_sobremesa}`, `${data?.porcao_lanche}`, `${data?.porcao_extras1}`, `${data?.porcao_extras2}`],
      ],
    })

    doc.setTextColor("#222222");
    doc.text(`Fezes: ${data?.fezes}             Vômitos: ${data?.vomitos}             Febres: ${data?.febres}`, 14, 55);
    doc.text(`Outras ocorrências: ${data?.message}`, 14, 65);

    setTimeout(async () => {
      setDownloading(false);
      // Save the PDF
      doc.save(`Relatorio-${data?.createdAtIntDTF}-${data?.student_name}.pdf`);
      toast('Sucesso', {
        description: 'O ficheiro foi descarregado.',
        duration: 5000,
        cancel: {
          label: 'Fechar',
          onClick: () => console.log('Closed!'),
        },
      })
    }, 2000);

    return data;
  }
}

function extractTime(timestamp: any) {
  // if (!timestamp) {
  //   return { hour: null, minute: null, second: null };
  // }

  const date = new Date(timestamp);
  const hr = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();

  return (
    <span>{hr < 10 ? `0${hr}` : hr}:{min < 10 ? `0${min}` : min}</span>
  )
}


function StudentData(data?: Report) {

  const [isSubmitting, setSubmitting] = useState(false)
  const [downloading, setLoading] = useState(false)
  const [isSendingEmail, setSending] = useState(false)


  const loadHandler = (state: boolean) => {
    setLoading(!state)
  }

  const sendingHandler = (state: boolean) => {
    setSending(!state)
    setTimeout(() => {
      toast('Sucesso', {
        description: 'O e-mail foi enviado.',
        duration: 5000,
        cancel: {
          label: 'Fechar',
          onClick: () => console.log('Cancel!'),
        },
      })
      setSending(state)
    }, 2000);
  }


  return (
    <Report data={data} extractTime={extractTime}></Report>
  )
}

export default GetReport