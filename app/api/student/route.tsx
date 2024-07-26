import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
  } from "@/components/ui/toast"
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'

export async function GET(){
    return NextResponse.json({
        hello: "hello from students"
    })
}

export async function POST(req: Request): Promise<NextResponse>{
    const cookieStore = cookies()
    const supabase = createClient()
    const data = await req.json()
  
    try {
       const { error } = await supabase.from('alunos').insert({ name: data.name, email: data.email, parent: data.parent, class: data.class, year: data.year })
       if(!error) {
        console.log("Aluno adicionado")
       }
    } catch (error) {
        console.log(error)        
    }

    return NextResponse.json({
        data
    })
}
