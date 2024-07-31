import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';
import { cookies } from 'next/headers';

export async function DELETE(req: Request): Promise<NextResponse> {
    const cookieStore = cookies();
    const supabase = createClient();
    const data = await req.json();

        try {
            const { error } = await supabase.from("alunos").delete().eq("id", data);
            if(!error) {
             console.log("Aluno deletado")
            }
         } catch (error) {
             console.log(error)        
         }
     
         return NextResponse.json({
             data
         })

}
