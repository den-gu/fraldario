import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';

export async function DELETE(req: Request): Promise<NextResponse> {
    const supabase = createClient();
    const data = await req.json();

        try {
            const { error } = await supabase.from("alunos").delete().eq("id", data);
            if(!error) {
             console.log("Aluno removido")
            }
         } catch (error) {
             console.log(error)        
         }
     
         return NextResponse.json({
             data
         })

}
