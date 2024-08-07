import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET(){
    const supabase = createClient()
 
    const response = await supabase.from("alunos").select("*")
    const data = response.data;
    
    return NextResponse.json({
        data
    })
}

export async function POST(req: Request): Promise<NextResponse>{
    const supabase = createClient()
    const data = await req.json()
  
    try {
       const { error } = await supabase.from('alunos').insert({ name: data.name, email: data.email, parent: data.parent, class: `T${data.class}`, year: data.year })
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
