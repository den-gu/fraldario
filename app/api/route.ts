import { NextResponse } from 'next/server'

export async function GET(){
    return NextResponse.json({
        hello: "hello"
    })
}

export async function POST(req: Request): Promise<NextResponse>{
    const data = await req.json()
    return NextResponse.json({
        data
    })
}