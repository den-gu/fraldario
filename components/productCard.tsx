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
    price: number;
    url: string
}


const ProductCard = (props: CardProps) => {
    return (
        <Card>
            <CardHeader>
                <img src={`https://picsum.photos/800/${Math.floor(
                    Math.random() * (300 - 200 + 1) + 200
                )}`}
                    style={{ width: "100%" }} alt='' />
                <CardTitle>{props.title}</CardTitle>
                <CardDescription>{props.description}</CardDescription>
            </CardHeader>
            {/* <CardContent>
                <p>Card Content</p>
            </CardContent> */}
            <CardFooter>
                <p>a partir de {props.price}</p>
            </CardFooter>
        </Card>
    );
}

export default ProductCard;