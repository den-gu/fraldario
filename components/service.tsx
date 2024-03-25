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
        <Card className='bg-[#232323] border-zinc-700/40 overflow-hidden h-auto pb-0'>
            <CardHeader>
                {/* <img src={`https://picsum.photos/800/${Math.floor(
                    Math.random() * (300 - 200 + 1) + 200
                )}`}
                    style={{ width: "100%" }} alt='' /> */}
                <CardTitle className='text-zinc-300 text-[18px] flex items-center justify-between'>
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