import React from 'react';
import { AvatarIcon } from "@radix-ui/react-icons";
import Avatar from "@/components/ui/avatar";
import { CardTitle } from '@/components/ui/card';
import ProjectImage from "@/assets/Logo_of_Twitter.svg.png";
import ProjectImage1 from "@/assets/Logo_of_Twitter.svg.png";
import Image from 'next/image';
import Footer from '@/components/footer';


const Portfolio: React.FC = () => {
  return (
    <div className="flex flex-col h-auto text-white">
        <section className="container w-full min-h-[80vh] flex flex-col md:flex-row md:items-center py-10 lg:py-0 gap-8">
            <div className="info flex-1 max-w-[700px]">
                <CardTitle className='text-zinc-300 text-[24px]'>@kreator</CardTitle>
                <h3 className='max-w-[100%] mt-8 text-4xl lg:text-5xl font-bold text-zinc-300/85'>A beautiful project<br/> management system</h3>
            </div>
            <div className="flex items-center justify-center w-full md:max-w-[300px] xl:min-w-[400px] border-2 border-zinc-800 h-96 rounded-[10px]">
                <Image 
                src={ProjectImage}
                alt=''
                width={100}
                height={100} 
                className='object-cover'/>
                </div>
        </section>
        <section className="container w-full min-h-[80vh] flex flex-col md:flex-row md:items-center py-10 lg:py-0 gap-8">
            <div className="flex items-center justify-center order-2 md:order-1 w-full md:max-w-[300px] xl:min-w-[400px] border-2 border-zinc-800 h-96 rounded-[10px]">
                <Image 
                src={ProjectImage}
                alt=''
                width={100}
                height={100} 
                className='object-cover'/>
                </div>
            <div className="info order-1 md:order-2 flex-1 max-w-[700px]">
                <CardTitle className='text-zinc-300 text-[24px]'>@kreator</CardTitle>
                <h3 className='max-w-[100%] mt-8 text-4xl lg:text-5xl font-bold text-zinc-300/85'>A beautiful project<br/> management system</h3>
            </div>
        </section>
    <Footer />
    </div>
  );
}

export default Portfolio;