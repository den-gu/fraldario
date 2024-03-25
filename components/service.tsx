import React from 'react';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface CardProps {
    title: string;
    description: string;
    tags?: string;
    url?: string
}


const Service = (props: CardProps) => {
    return (
        <Card className='bg-[#232323] border-zinc-700/40 border-2 hover:border-green-700/40 overflow-hidden h-auto pb-0 hover:animate-in animate-out hover:scale-[1.02] transition-all'>
            <CardHeader>
                <CardTitle className='text-zinc-300 text-[16px] flex items-center justify-between'>
                    {props.title}
                    <i className="ri-arrow-right-s-line font-extralight text-[15px] text-green-600"></i>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className='text-[14px] font-medium text-zinc-400'>{props.description}</CardDescription>
            </CardContent>
            <CardFooter className='bg-[#2E2E2E] py-2'>
                <p className='text-[14px] font-medium text-zinc-400 text-nowrap overflow-hidden text-ellipsis'>{props.tags}</p>
            </CardFooter>
        </Card>
    );
}

export default Service;