import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';


export async function PUT(req: Request): Promise<NextResponse> {
    const supabase = createClient();
    const data = await req.json();

    
    console.log(data)

        try {
            const { error } = await supabase.from('alunos').update({ name: data.name, email: data.email, parent: data.parent }).eq('id', data.id)

            if(!error) {
             console.log("Informação actualizada.")
            }
            
         } catch (error) {
             console.log(error)        
         }
     
         return NextResponse.json({
             data
         })

}

export async function DELETE(req: Request): Promise<NextResponse> {
    const supabase = createClient();
    const data = await req.json();

    
    console.log(data)

        try {
            const { error } = await supabase.from("alunos").delete().eq("id", data);
            if(!error) {
             console.log("Aluno removido")
            }
            console.log(error);

         } catch (error) {
             console.log(error)        
         }
     
         return NextResponse.json({
             data
         })

}
