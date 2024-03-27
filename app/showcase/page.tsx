import React from "react";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import Image from "next/image";

import Avatar from '@/assets/Logo_of_Twitter.svg.png'
import { AvatarIcon } from "@radix-ui/react-icons";

const Showcase: React.FC = () => {
  return (
    <div className="container w-full min-h-screen flex bg-[#1C1C1C]">
      <div className="board sticky top-0 left-0 flex-1 max-w-[280px] h-screen">
        <Image 
        src={Avatar}
        alt=""
        width={100}
        height={100}
        />
      </div>
      <div className="flex-1 pt-3 border-x border-zinc-800 px-6">
        <div className="flex items-center gap-5 pb-3 border-0 border-zinc-800">
          <Button
            variant="default"
            className="h-8 text-[12px] border-2 border-zinc-600/50 bg-zinc-400/10 hover:bg-zinc-900 font-semibold gap-2 rounded-[5px]"
          >
            Request a demo
          </Button>
          <Button
            variant="default"
            className="h-8 text-[12px] border-2 border-green-500/30 bg-green-900 hover:bg-green-700/10 font-semibold gap-2 rounded-[5px]"
          >
            Buy
          </Button>
        </div>
        <h3 className="text-[16px] mt-2 text-zinc-300 font-medium">
          @ Yendza
        </h3>
        <p className="text-[13px] mt-2 text-zinc-400 font-normal">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officia non
          tenetur est commodi officiis inventore, consequuntur quis iusto
          tempora voluptatem.
        </p>
        <CardTitle className="mt-10 text-zinc-400">Screenshots</CardTitle>
      </div>
      <div className="sidebar flex-1 max-w-[320px]">Sidebar</div>
    </div>
  );
};

export default Showcase;
