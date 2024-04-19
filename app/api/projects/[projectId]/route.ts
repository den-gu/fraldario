import { NextResponse } from "next/server"
import projects from "@/projects.json"

export async function GET(req: Request, context: any): Promise<NextResponse>{
    const { params } = context
    const project = projects.filter(p => params.projectId == p.id.toString())

    return NextResponse.json({
        project
    })
}