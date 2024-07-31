import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {

    const supabase = createClient();
    const { turma } = await req.json()

    const { data, error } = await supabase
        .from("alunos")
        .select('*')
        .eq("class", turma)

    if (error || !data) {
        return NextResponse.json({
            message: "Não existem alunos nesta turma.",
    })}

    return NextResponse.json({
        data: data
    });        
}