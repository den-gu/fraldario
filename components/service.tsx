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
        <Card className='bg-[#232323] pb-0 border-zinc-700/40 border-2 px-0 hover:border-green-700/40 overflow-hidden h-auto'>
            <CardHeader className='py-4 px-6'>
                <CardTitle className='text-zinc-300 text-[14px] px-0 flex items-center justify-between'>
                    {props.title}
                    <i className="ri-arrow-right-s-line font-extralight text-[15px] text-green-400"></i>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className='text-[13px] font-medium text-zinc-400 line-clamp-4'>{props.description}</CardDescription>
            </CardContent>
            {/* <CardFooter className='bg-[#2E2E2E] py-2'>
                <p className='text-[14px] font-medium text-zinc-400 text-nowrap overflow-hidden text-ellipsis'>{props.tags}</p>
            </CardFooter> */}
        </Card>
    );
}

export default Service;