import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {

    const supabase = createClient();

    const { data, error } = await supabase
        .from("meals")
        .select('pequeno_almoco, almoco1, almoco2, sobremesa, lanche, extras1, extras2,')
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

    console.log(data);
  
    try {
       const { error } = await supabase.from('meals').insert({ 
        pequeno_almoco: data.pequeno_almoco, almoco1: data.almoco1, almoco2: data.almoco2,
        sobremesa: data.sobremesa, lanche: data.lanche,
        extras1: data.extras1, extras2: data.extras2,
        pequeno_almoco_extra1: data.pequeno_almoco_extra1, pequeno_almoco_extra2: data.pequeno_almoco_extra2,
        almoco1_extra1: data.almoco1_extra1, almoco1_extra2: data.almoco1_extra2,
        almoco2_extra1: data.almoco2_extra1, almoco2_extra2: data.almoco2_extra2,
        sobremesa_extra1: data.sobremesa_extra1, sobremesa_extra2: data.sobremesa_extra2,
        lanche_extra1: data.lanche_extra1, lanche_extra2: data.lanche_extra2,
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
