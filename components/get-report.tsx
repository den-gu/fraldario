"use client"

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
// import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"
import { getReports } from "@/lib/api";



const FormSchema = z.object({
    reportDate: z.date({
      required_error: "Data do relatório é obrigatória.",
    }),
})

const GetReport: React.FC = () => {

  const [loading, setLoading] = useState(false)
  const [students, setData] = useState([])

  useEffect(() => {
    const getData = async () => {
        setLoading(true);
        try {
            const response = await getReports();
            const { data } = await response?.json();
            setData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
    getData();
}, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast('You submitted the following values:', {
        description: (
            <pre className="mt-2 rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(data, null, 2)}</code>
            </pre>
        ),
        duration: 5000,
        cancel: {
          label: 'Fechar',
          onClick: () => console.log('Cancel!'),
        },
      })
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
      {JSON.stringify(students, null)}
    </Form>
  )
}

export default GetReport