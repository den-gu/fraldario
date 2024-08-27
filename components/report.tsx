import React from 'react'
import Link from "next/link";
import Image from "next/image";

interface IReport {
    data: any;
    extractTime: Function;
}


export const Report = ({data, extractTime}: IReport) => {
  return (
    <div className="flex flex-col px-8">
      <div className="row flex items-center justify-between">
      <Image src="https://i.ibb.co/H4Wvchg/ofraldario.webp" width={150} height={30} alt="Fraldario Logo" />
      <div className="text-right">
        <p className="m-0 text-xs font-medium text-gray-500">
          Hora: {extractTime(data?.created_at)}
        </p>
        <p className="m-0 text-xs font-medium text-gray-500">
          ID: {data?.id.slice(0, 12)}
        </p>
      </div>
      </div>
      <div className="row mt-4 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-[15px]">{data?.student_name}</h3>
          <Link href={`mailto:${data?.email}`} className="text-muted-foreground text-sm" target="_blank">{data?.email}</Link>
        </div>
        <p className="text-[13px]">Comportamento: <b>{data?.behavior}</b></p>
      </div>
      <div className="grid grid-cols-4 mt-4">
        <div className="col-span-3">
          <h3 className="pb-2 font-bold text-[13px]">Refeições</h3>
          <p className="text-[14px]"><b>Pequeno-almoço:</b> {data?.pequenoAlmoco}</p>
        </div>
        <div className="col-span-1">
          <h3 className="pb-2 font-bold text-[13px]">Porção</h3>
          <p className="text-[14px]">{data?.porcaoPequenoAlmoco}</p>
        </div>
      </div>
      {data?.porcaoExtras1 !== "" ? 
      <div className="grid grid-cols-4 mt-2">
      <div className="col-span-3">
        <p className="text-[14px]"><b>Extra da manhã:</b> {data?.extras1}</p>
      </div>
      <div className="col-span-1">
        <p className="text-[14px]">{data?.porcaoExtras1}</p>
      </div>
    </div>
    : ''}
      <div className="grid grid-cols-4 mt-2">
        <div className="col-span-3">
          <p className="text-[14px]"><b>1 Almoço:</b> {data?.almoco1}</p>
        </div>
        <div className="col-span-1">
          <p className="text-[14px]">{data?.porcaoAlmoco1}</p>
        </div>
      </div>
      <div className="grid grid-cols-4 mt-2">
        <div className="col-span-3">
          <p className="text-[14px]"><b>2 Almoço:</b> {data?.almoco2}</p>
        </div>
        <div className="col-span-1">
          <p className="text-[14px]">{data?.porcaoAlmoco2}</p>
        </div>
      </div>
      <div className="grid grid-cols-4 mt-2">
        <div className="col-span-3">
          <p className="text-[14px]"><b>Sobremesa:</b> {data?.sobremesa}</p>
        </div>
        <div className="col-span-1">
          <p className="text-[14px]">{data?.porcaoSobremesa}</p>
        </div>
      </div>
      <div className="grid grid-cols-4 mt-2">
        <div className="col-span-3">
          <p className="text-[14px]"><b>Lanche:</b> {data?.lanche}</p>
        </div>
        <div className="col-span-1">
          <p className="text-[14px]">{data?.porcaoLanche}</p>
        </div>
      </div>
      {data?.porcaoExtras2 !== "" ? 
      <div className="grid grid-cols-4 mt-2">
      <div className="col-span-3">
        <p className="text-[14px]"><b>Extra da tarde:</b> {data?.extras2}</p>
      </div>
      <div className="col-span-1">
        <p className="text-[14px]">{data?.porcaoExtras2}</p>
      </div>
    </div>
    : ''}
      <div className="grid grid-cols-4 mt-6">
        <div className="col-span-3">
          <p className="text-[14px]"><b>Fezes:</b></p>
        </div>
        <div className="col-span-1">
          <p className="text-[14px]">{data?.fezes}{Number(data?.fezesNr) > 0 ? `: ${data?.fezesNr}x` : ``}</p>
        </div>
      </div>
      <div className="grid grid-cols-4 mt-2">
        <div className="col-span-3">
          <p className="text-[14px]"><b>Vômitos:</b></p>
        </div>
        <div className="col-span-1">
          <p className="text-[14px]">{data?.vomitos}{Number(data?.vomitosNr) > 0 ? `: ${data?.vomitosNr}x` : ``}</p>
        </div>
      </div>
      <div className="grid grid-cols-4 mt-2">
        <div className="col-span-3">
          <p className="text-[14px]"><b>Febres:</b></p>
        </div>
        <div className="col-span-1">
          <p className="text-[14px]">{data?.febres}{Number(data?.febresNr) > 0 ? `: ${data?.febresNr}° C` : ``}</p>
        </div>
      </div>
      <p className="text-[14px] mt-5"><b>Outras ocorrências:</b> {data?.message}</p>
    </div>
  )
}