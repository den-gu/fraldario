/* eslint-disable @next/next/no-img-element */
"use client"

import React from 'react';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Measure from 'react-measure';
import { Button } from './ui/button';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


const Products: React.FC = () => {

  const products = [
    {
      id: 1,
      name: "Banner",
      desc: "Temos banners e claro tudo ao melhor preço",
      price: 200
    },
    {
      id: 2,
      name: "RollUp",
      desc: "Temos banners de diferentes tipos e qualidade e co melhor preço",
      price: 400
    },
    {
      id: 3,
      name: "Chávenas",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Et soluta atque voluptatum deleniti veritatis laborum natus odio, tempora suscipit ullam totam omnis possimus eos iste?",
      price: 400
    },
    {
      id: 4,
      name: "Autocolantes",
      desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum cumque fugit modi. Vel, in cupiditate magni voluptatibus tempore sed provident odit, mollitia ratione fuga cum deleniti, ipsum voluptates pariatur similique?",
      price: 400
    },
    {
      id: 5,
      name: "Bloco de notas",
      desc: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Expedita possimus, veniam aspernatur quis soluta optio illum placeat.",
      price: 400
    },
    {
      id: 6,
      name: "Camisetes",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, voluptatem?",
      price: 400
    },
    {
      id: 7,
      name: "Vinil",
      desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolor deleniti sequi, cupiditate est dolores minima quasi assumenda nulla rem vitae ad alias numquam sint et veniam optio quos perspiciatis sunt nisi delectus?",
      price: 400
    },
    {
      id: 8,
      name: "Carimbos",
      desc: "Técnica de impressão versátil, ideal para materiais rígidos e flexíveis, oferecendo cores vibrantes e durabilidade.",
      price: 400
    },
    {
      id: 9,
      name: "Sacolas",
      desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorem aliquid dicta ea voluptas voluptate iusto.",
      price: 100
    }
  ]
  
  return (
    <div className="mt-20 relative flex flex-col items-center">
      <h2 className='mb-16 text-3xl font-bold text-zinc-300/85 text-center'>Explore nossa coleção</h2>
            
      <ResponsiveMasonry
      className='container z-20'
        columnsCountBreakPoints={{ 300: 2, 500: 3, 700: 4, 900: 3 }}
      >
        <Masonry gutter="20px">
          {products.map((item, i) => (
            <Measure key={i}>
              {({ measureRef }) => (
                  <Card ref={measureRef} className='hover:cursor-pointer bg-[#232323] border-zinc-700/40 border-2 hover:border-green-700/40 overflow-hidden h-auto pb-0 hover:animate-in animate-out hover:scale-[1.02] transition-all'>
            <CardHeader>
                <CardTitle className='text-zinc-300 text-[16px] flex items-center justify-between'>
                    {item.name}
                    {/* <i className="ri-arrow-right-s-line font-extralight text-[15px] text-green-600"></i> */}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className='text-[14px] font-medium text-zinc-400'>{item.desc}</CardDescription>
            </CardContent>
            <CardFooter className='bg-[#2E2E2E] py-2'>
                <p className='text-[14px] font-medium text-zinc-400 text-nowrap overflow-hidden text-ellipsis'>a partir de {item.price} MZN</p>
            </CardFooter>
        </Card>
              )}
            </Measure>
          ))}
        </Masonry>
      </ResponsiveMasonry>
      {/* <div className="shadow-gradient w-full py-20 relative top-[-100px] z-10"></div> */}
      <Button
            variant="default"
            className="h-10 mt-16 border-2 border-zinc-600/50 bg-zinc-400/10 hover:bg-zinc-900 font-semibold gap-2 rounded-[5px]"
          >
            Ver mais
          </Button>
    </div>
  );
}

export default Products;