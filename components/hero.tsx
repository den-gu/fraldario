import React from "react";
import { Button } from "./ui/button";

const Hero: React.FC = () => {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col items-center">
        <h1 className="text-7xl font-bold text-zinc-300/85 text-center">
          The Intuitive
          <br />
          <span className="text-green-500">Vue Framework</span>
        </h1>
        <p className="py-6 max-w-[60%] text-zinc-300 text-center text-[17px] font-semibold">
          Supabase is an open source Firebase alternative. Start your project
          with a Postgres database, Authentication, instant APIs, Edge
          Functions, Realtime subscriptions, Storage, and Vector embeddings.
        </p>
        <div id="cta" className="flex gap-5 text-zinc-300 text-[18px]">
          <Button
            variant="default"
            className="h-10 border border-green-500/30 bg-green-700/10 hover:bg-green-900 font-semibold gap-2 rounded-[5px]"
          >
            <i className="ri-store-2-line"></i>
            Ver produtos
          </Button>
          <Button
            variant="default"
            className="h-10 border border-zinc-600/50 bg-zinc-400/10 hover:bg-zinc-900 font-semibold gap-2 rounded-[5px]"
          >
            Saiba mais
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
