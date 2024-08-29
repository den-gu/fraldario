import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {

    const supabase = createClient();

    const { data, error } = await supabase
        .from("alunos")
        .select('*')
        .order("name", { ascending: true })

    if (error || !data) {
        return NextResponse.json({
            message: "Não existem alunos na base de dados.",
    })}

    return NextResponse.json({
        data: data
    });        
}

export async function POST(req: Request): Promise<NextResponse>{
    const supabase = createClient()
    const data = await req.json()
  
    try {
       const { error } = await supabase.from('alunos').insert({ name: data.name, email: data.email, parent: data.parent })
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
