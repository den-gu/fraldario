import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {

    const supabase = createClient();

    const { data, error } = await supabase
        .from("meals")
        .select('pequeno_almoco, extras_pequeno_almoco, almoco1, almoco2, extras_almoco, sobremesa, lanche')
        .order("created_at", { ascending: false })
        .limit(1)

    if (error || !data) {
        return NextResponse.json({
            message: "Não existem refeições na base de dados.",
    })}

    return NextResponse.json({
        data: data
    });        
}

export async function POST(req: Request): Promise<NextResponse>{
    const supabase = createClient()
    const data = await req.json()
  
    try {
       const { error } = await supabase.from('meals').insert({ 
        pequeno_almoco: data.pequenoAlmoco, extras_pequeno_almoco: data.extrasPequenoAlmoco, 
        almoco1: data.almoco1, almoco2: data.almoco2, extras_almoco: data.extrasAlmoco,
        sobremesa: data.sobremesa, lanche: data.lanche
     })

        if(!error) {
        console.log("Refeição adicionada")
       }
    } catch (error) {
        console.log(error)
    }

    return NextResponse.json({
        data
    })
}
