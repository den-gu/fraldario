import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET(req: any){
    const cookieStore = cookies()
    const supabase = createClient()

    const values = req;
 
    const response = await supabase.from("users").select("*")
    const data = response.data;

    console.log(values);
    
    return NextResponse.json({
        data
    })
}