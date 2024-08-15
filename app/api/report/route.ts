import { mailOptions, transporter } from '@/config/nodemailer'
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

    try {
        const { error } = await supabase.from('reports').insert({
            student_name: data.name,
            email: data.email, behavior: data.behavior, pequeno_almoco: data.pequenoAlmoco,
            porcao_pequeno_almoco: data.porcaoPequenoAlmoco,
            almoco1: data.almoco1, porcao_almoco1: data.porcaoAlmoco1,
            almoco2: data.almoco2, porcao_almoco2: data.porcaoAlmoco2,
            sobremesa: data.sobremesa, porcao_sobremesa: data.porcaoSobremesa,
            lanche: data.lanche, porcao_lanche: data.porcaoLanche, extras1: data.extras1,
            porcao_extras1: data.porcaoExtras1, extras2: data.extras2,
            porcao_extras2: data.porcaoExtras2, fezes: data.fezes, vomitos: data.vomitos,
            febres: data.febres, message: data.description, student_id: data.id,
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