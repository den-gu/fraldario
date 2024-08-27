import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(){
    const supabase = createClient();

    const { data, error } = await supabase
        .from("reports")
        .select('')
        .order("student_name", { ascending: true })

    if (error || !data) {
        return NextResponse.json({
            message: "Não existem informações para esta data.",
    })}

    return NextResponse.json({
        data: data
    });        
}

export async function POST(req: Request): Promise<NextResponse>{
    const supabase = createClient()
    const data = await req.json()

    const date = new Date();
    const createdAt = new Intl.DateTimeFormat('pt-BR').format(date);

    try {
        const { error } = await supabase.from('reports').insert({
            student_name: data.student_name,
            email: data.email, behavior: data.behavior, pequeno_almoco: data.pequeno_almoco,
            porcao_pequeno_almoco: data.porcao_pequeno_almoco,
            almoco1: data.almoco1, porcao_almoco1: data.porcao_almoco1,
            almoco2: data.almoco2, porcao_almoco2: data.porcao_almoco2,
            sobremesa: data.sobremesa, porcao_sobremesa: data.porcao_sobremesa,
            lanche: data.lanche, porcao_lanche: data.porcao_lanche, extras1: data.extras1,
            porcao_extras1: data.porcao_extras1, extras2: data.extras2,
            porcao_extras2: data.porcao_extras2, fezes: data.fezes, vomitos: data.vomitos,
            febres: data.febres, message: data.message,
            createdAtIntDTF: createdAt, nr_fezes: data.nr_fezes, nr_vomitos: data.nr_vomitos, nr_febres: data.nr_febres
        })

        if(!error) {
            console.log('Relatório adicionado')
        }
  } catch (error) {
      console.log(error);
  }

    return NextResponse.json({
        data
    })
}