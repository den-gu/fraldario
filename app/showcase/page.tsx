"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";

import ProjectImage from "@/assets/Logo_of_Twitter.svg.png";
import { AvatarIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import Avatar from "@/components/ui/avatar";
import Products from "@/containers/products";

const Showcase: React.FC = () => {
  const [showdesc, setDesc] = useState(false);

  const descHandler = (item: any) => {
    setDesc(!item);
  };

  return (
    <div className="container w-full min-h-screen flex bg-[#1C1C1C]">

      <div className="board pr-4 sticky top-0 left-0 pt-8 flex-1 max-w-[250px] h-screen">
        <div className="info flex flex-col items-center">
          <Avatar source={ProjectImage} size={150}/>
          <CardTitle className="mt-4 text-zinc-300 font-medium">
            @Sit_amet
          </CardTitle>
        </div>
        <CardTitle className="mt-10 text-zinc-400 text-[15px]">
          Tools used
        </CardTitle>
        <CardDescription className="text-[13px] mt-2 text-zinc-400 font-normal">
          #Nextjs #Tailwind #Prisma #Nodejs #supabase
        </CardDescription>
      </div>


      <div className="flex-1 pt-8 border-r border-zinc-800 px-5">
        <h3 className="text-[16px] text-zinc-300 font-medium">
          @Sit_amet<sup className="text-[18px] ml-2 text-green-400">$ 5200</sup>
        </h3>
        <CardDescription className="text-[13px] mt-2 text-zinc-400 font-normal">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit..
        </CardDescription>
        <div className="flex items-center gap-5 mt-4 border-0 border-zinc-800">
          <Button
            variant="default"
            className="flex items-center h-8 text-[12px] border-2 border-zinc-600/50 bg-zinc-400/10 hover:bg-zinc-900 font-semibold gap-1 rounded-[5px]"
          >
            <i className="ri-twitter-x-line text-[14px] font-thin"></i>
            <i className="ri-email-circle-line font-extralight text-[15px] text-green-400"></i>
            Send a Message
          </Button>
          <Button
            variant="default"
            className="h-8 text-[12px] border-2 border-green-500/30 bg-green-900 hover:bg-green-700/10 font-semibold gap-2 rounded-[5px]"
          >
            Buy
          </Button>
        </div>
        <CardTitle className="mt-8 text-zinc-400 text-[15px]">
          Description
        </CardTitle>
        <CardDescription
          className={`${
            showdesc === true ? "" : "line-clamp-4"
          }  mt-2 text-zinc-500 text-[13px]`}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae odit
          tempore, nam magni suscipit dolore asperiores cumque nobis, voluptates
          corrupti alias pariatur reiciendis. Consequatur saepe, similique
          architecto ratione maiores voluptas? Repellendus magnam blanditiis
          illum impedit voluptatibus nam ipsam quia, natus libero nulla tenetur
          voluptate dolore voluptatum aliquam iusto atque placeat, dolor
          deserunt dicta consequatur voluptates sit earum. Non, nisi commodi. Ad
          tempora explicabo eveniet. Iure, consequuntur magni. Perferendis fuga
          iure sed inventore neque velit, vitae in unde natus maxime ad
          laudantium exercitationem error accusantium vero totam reiciendis
          repudiandae! Mollitia, omnis? Quam quos similique nihil placeat dolore
          eos sequi molestiae rem, incidunt, quaerat velit! Voluptatem dolor
          officia, quis, in ea quaerat, veritatis aliquid libero perferendis quo
          deserunt. Rerum recusandae aspernatur nobis.
        </CardDescription>
        <Button
          variant="default"
          onClick={() => descHandler(showdesc)}
          className="bg-transparent text-[12px] p-0 text-blue-400 hover:bg-transparent"
        >
          <span className="flex items-center gap-1">{`${showdesc === true ? 'Show less' : 'Show more'}`}
            <i className={`ri-arrow-${showdesc === true ? 'up' : 'down'}-s-line text-[12px] font-thin mt-1`}></i>
          </span>
        </Button>
        <CardTitle className="mt-6 text-zinc-400 text-[15px]">
          Screenshots
        </CardTitle>
        
      </div>


      <div className="sidebar flex-1 max-w-[550px] pl-5 pb-20">
        <CardTitle className="mt-8 text-[17px] text-zinc-300 font-medium">
          Explore nossa colecção
        </CardTitle>
        <Products />
      </div>

    </div>
  );
};

export default Showcase;
