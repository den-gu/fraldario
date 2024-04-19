import { NextResponse } from "next/server"
import projects from "@/projects.json"

export async function GET() {
    return NextResponse.json({
        projects
    })
}