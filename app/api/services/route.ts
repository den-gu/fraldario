import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse>{
    return NextResponse.json({
        services: [{
                bPlanning: {
                    title: "Business Planning",
                    desc: ""
                },
                design: {
                    title: "Graphic Design",
                    desc: ""
                },
                software: {
                    dev: {
                        title: "Software Development",
                        desc: ""
                    },
                    seo: {
                        title: "Search Engine Optimization",
                        desc: ""
                    },
                },
                socialMedia: {
                    title: "Social Media Management",
                    desc: ""
                },
    }]
    })
}