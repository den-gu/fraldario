"use client"

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
// import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DateRange } from "react-day-picker"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient";
import { addDays, format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { sendReport, sendReports } from "@/lib/api"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Report } from "./report";
import { EditReport } from "./edit-report";

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
  febresNr: string,
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
  const [sendAll, setSendAll] = useState(false)
  const [isSendingEmail, setSending] = useState(false)
  const [reports, setReports] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState<any>()
  const [time, setTime] = useState("single")

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2025, 0, 20),
    to: addDays(new Date(2025, 0, 20), 20),
  })

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 mt-2">
        <div className="w-full max-w-[800px] pt-4">
        <h3 className="text-lg font-extrabold tracking-tight m-0 p-0 lg:text-xl">
          Calendário
        </h3>
    </div>
        <div className="w-full max-w-[800px]">
          <Select value={time} onValueChange={(e) => {
                          //field.onChange(e);
                          setTime(e);
                        }} >
  <SelectTrigger className="w-full md:w-[180px] py-2">
    <SelectValue placeholder={time} />
  </SelectTrigger>
  <SelectContent>
    <SelectItem className="text-[13px]" value="single">Singular</SelectItem>
    <SelectItem className="text-[13px]" value="range">Intervalo de dias</SelectItem>
  </SelectContent>
</Select>
        </div>
        {time === "single" 
          ? <div className="flex flex-col md:flex-row w-full max-w-[800px] gap-3">
            <FormField
          control={form.control}
          name="reportDate"
          render={({ field }) => (
            <FormItem className="">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full md:w-fit font-normal">
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
                    onSelect={(e) => {
                      field.onChange(e);
                      setSelectedDate(e)
                    }}
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
          </div>
          : <div className="flex flex-col md:flex-row w-full max-w-[800px] gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className="w-full md:w-fit font-normal"
          >
            {/*<CalendarIcon />*/} 
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Escolha uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
            <Button type="submit">Pesquisar</Button>
    </div>
        }
      </form>
      {loading
        ? <div className="flex justify-center items-center mt-20">
          <i className="ri-loader-line animate-spin text-[14px]"></i>
        </div>
        : reports.length !== 0
          ? <div>
          <div className="flex items-center gap-1 mt-5">
            <b className="text-muted-foreground mr-3">Total: {reports.length}</b>
            <Button variant="link" onClick={() => downloadAllReports()} disabled={downloadAll} className="text-blue-400 text-[13px] h-0 py-0 px-2">
            {downloadAll ? (
              <i className="ri-loader-line animate-spin text-[14px]"></i>
            )
              : (
                <>
                  <i className="ri-download-line mr-1 text-[13px]"></i> Baixar relatório
                </>
              )}
          </Button>
          <Button variant="link" onClick={() => sendAllReports(reports)} disabled={sendAll} className="text-blue-400 text-[13px] h-0 py-0 px-2">
            {sendAll ? (
              <i className="ri-loader-line animate-spin text-[14px]"></i>
            )
              : (
                <>
                  <i className="ri-mail-send-line mr-1 text-[13px]"></i> Enviar todos
                </>
              )}
          </Button>
          </div>
            <Table className="rounded-sm overflow-hidden mt-2">
            {

            }
            {/* JSON.stringify(reports, null) */}
            {/* <TableCaption>A list of your recent alunos.</TableCaption> */}
            <TableHeader className="bg-zinc-200/50 border border-zinc-200 text-[13px]">
              <TableRow>
                {/* <TableHead className="w-[100px]">Código</TableHead> */}
                <TableHead className="max-w-14">#ID</TableHead>
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
                    <EditReport student_name={data.student_name} behavior={data.behavior}
                          email={data.email} id={data.id} created_at={data.created_at}
                          pequeno_almoco={data.pequeno_almoco} porcao_pequeno_almoco={data.porcao_pequeno_almoco}
                          almoco1={data.almoco1} porcao_almoco1={data.porcao_almoco1} almoco2={data.almoco2}
                          porcao_almoco2={data.porcao_almoco2} sobremesa={data.sobremesa} porcao_sobremesa={data.porcao_sobremesa}
                          lanche={data.lanche} porcao_lanche={data.porcao_lanche} extras1={data.extras1} porcao_extras1={data.porcao_extras1}
                          extras2={data.extras2} porcao_extras2={data.porcao_extras2} fezes={data.fezes} vomitos={data.vomitos} 
                          febres={data.febres} message={data.message} nr_fezes={data.nr_fezes} nr_vomitos={data.nr_vomitos} nr_febres={data.nr_febres}
                      />
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
          </Table>
          </div>
          : <div className="flex justify-center items-center mt-20">
            <p className="text-muted-foreground">Não há resultados.</p>
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

  async function sendAllReports(data: any) {
    // 2. Define a submit handler.
    try {
      // sendingHandler(isSendingEmail, data.email);
      toast('Processando...', {
        description: `A enviar ${data.length} emails.`,
        duration: 12000,
        cancel: {
          label: 'Fechar',
          onClick: () => console.log('Cancel!'),
        },
      })

      await sendReports(data);
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
    const createdAt = new Intl.DateTimeFormat('pt-BR').format(selectedDate);
    const tableData = [];
    let image = new Image();

// Loop through the reports and add each row to the tableData array
for (const data of reports) {

  tableData.push([
    `${data?.student_name}`,
    `${data?.behavior}`,
    `${data?.porcao_pequeno_almoco !== 'Não aplicável' ? data?.pequeno_almoco + ': ' + data?.porcao_pequeno_almoco : ''}`,
    `${data?.porcao_extras1 !== '' && data.porcao_extras1 !== 'Não aplicável' && data?.porcao_extras1 !== null ? data?.extras1 + ': ' + data?.porcao_extras1 : ''}`,
    `${data?.porcao_almoco1 !== 'Não aplicável' ? data?.almoco1 + ': ' + data?.porcao_almoco1 : ''}`,
    `${data?.porcao_almoco2 !== 'Não aplicável' ? data?.almoco2 + ': ' + data?.porcao_almoco2 : ''}`,
    `${data?.porcao_sobremesa !== 'Não aplicável' ? data?.sobremesa + ': ' + data?.porcao_sobremesa : ''}`,
    `${data?.porcao_extras2 !== '' && data.porcao_extras2 !== 'Não aplicável' && data?.porcao_extras2 !== null ? data?.extras2 + ': ' + data?.porcao_extras2 : ''}`,
    // `${data?.extras2}: ${data?.porcao_extras2}`,
    `${data?.porcao_lanche !== 'Não aplicável' ? data?.lanche + ': ' + data?.porcao_lanche : ''}`,
    `${data?.fezes}${data?.nr_fezes > 0 ? `: ${data?.nr_fezes}x` : ``}`,
    `${data?.vomitos}${data?.nr_vomitos > 0 ? `: ${data?.nr_vomitos}x` : ``}`,
    `${data?.febres}${data?.nr_febres > 0 ? `: ${data?.nr_febres}° C` : ``}`
  ]);
}

    image.src = 'https://raw.githubusercontent.com/den-gu/fraldario/refs/heads/main/fraldario.webp';

    doc.addImage(image, 'JPG', 14, 8, 50, 0); //base64 image, format, x-coordinate, y-coordinate, width, height
    
    doc.setFontSize(13);
    doc.text('Relatório diário', 75, 18);
    doc.setFontSize(8);
    doc.setTextColor("#666666");
    doc.text(`Data: ${createdAt}`, 75, 22);

      // Generate the table
      autoTable(doc, {
        head: [["Nome", "Comp.", "Peq.almoço", "Snack", "Almoço(Entrada)", "Prato principal", "Sobremesa", "Snack", "Lanche", "Fezes", "Vômitos", "Febres"]],
        theme: 'grid',
        headStyles: {fillColor : [18, 105, 24], fontStyle: 'bold'},
        styles: {
            fontSize: 7
        },
        margin: { top: 28, bottom: 0 },
        body: tableData,
      })
 
    setTimeout(async () => {
      setDownloadAll(false);
      // Save the PDF
      doc.save(`Relatório-${createdAt}.pdf`);
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

    image.src = 'https://raw.githubusercontent.com/den-gu/fraldario/refs/heads/main/fraldario.webp';

    doc.addImage(image, 'JPG', 14, 8, 50, 0); //base64 image, format, x-coordinate, y-coordinate, width, height

    doc.setFontSize(15);
    doc.text('Relatório diário', 75, 18);
    doc.setFontSize(10);
    doc.setTextColor("#666666");
    doc.text(`Data: ${data?.createdAtIntDTF}`, 75, 22);
    doc.text(`Nome da criança: ${data?.student_name}`, 14, 32);
    doc.text('Refeições', 14, 40);

    // Generate the table
    autoTable(doc, {
      head: [["Pequeno-almoço", "Snack", "Almoço (Entrada)", "Prato principal", "Sobremesa", "Snack", "Lanche"]],
      theme: 'grid',
      headStyles: {fillColor : [18, 105, 24], fontStyle: 'bold'},
      styles: {
        fontSize: 9
      },
      margin: { top: 43 },
      body: [
        [`${data?.porcao_pequeno_almoco !== 'Não aplicável' ? data?.pequeno_almoco : ''}`, `${data?.porcao_extras1 !== '' && data.porcao_extras1 !== 'Não aplicável' && data?.porcao_extras1 !== null ? data?.extras1 : ''}`, `${data?.porcao_almoco1 !== 'Não aplicável' ? data?.almoco1 : ''}`, `${data?.porcao_almoco2 !== 'Não aplicável' ? data?.almoco2 : ''}`, `${data?.porcao_sobremesa !== 'Não aplicável' ? data?.sobremesa : ''}`, `${data?.porcao_extras2 !== '' && data?.porcao_extras2 !== 'Não aplicável' && data?.porcao_extras2 !== null ? data?.extras2 : ''}`, `${data?.porcao_lanche !== 'Não aplicável' ? data?.lanche : ''}`],
        [`${data?.porcao_pequeno_almoco !== 'Não aplicável' ? data?.porcao_pequeno_almoco : ''}`, `${data?.porcao_extras1 !== '' && data?.porcao_extras1 !== 'Não aplicável' ? data?.porcao_extras1 : ''}`, `${data?.porcao_almoco1 !== 'Não aplicável' ? data?.porcao_almoco1 : ''}`, `${data?.porcao_almoco2 !== 'Não aplicável' ? data?.porcao_almoco2 : ''}`, `${data?.porcao_sobremesa !== 'Não aplicável' ? data?.porcao_sobremesa : '' }`, `${data?.porcao_extras2 !== '' && data?.porcao_extras2 !== 'Não aplicável' ? data?.porcao_extras2 : ''}`, `${data?.porcao_lanche !== 'Não aplicável' ? data?.porcao_lanche : ''}`],
      ],
    })

    doc.setTextColor("#222222");
    doc.text(`Fezes: ${data?.fezes}${data?.nr_fezes > 0 ? (': '+ data?.nr_fezes + 'x') : ''}             Vômitos: ${data?.vomitos}${data?.nr_vomitos > 0 ? (': '+ data?.nr_vomitos + 'x') : ''}             Febres: ${data?.febres}${data?.nr_febres > 0 ? (': '+ data?.nr_febres + '° C') : ''}`, 14, 75);
    doc.text(`Outras ocorrências: ${data?.message !== '' && data?.message !== null ? data?.message : '-------'}`, 14, 85);

    setTimeout(async () => {
      setDownloading(false);
      // Save the PDF
      doc.save(`Relatório-${data?.createdAtIntDTF}-${data?.student_name}.pdf`);
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
