"use client"

import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { createClient } from '@/utils/supabase/server'
import { deleteStudent } from '@/lib/api'


interface IDeleteAction {
    alunoID: string;
}

export default function DeleteAction(props: IDeleteAction) {
    
// console.log(props.alunoID)
    // 2. Define a submit handler.
  async function deleteHandler(id: any) {

    try {
      await deleteStudent(id)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AlertDialog>
  <AlertDialogTrigger>
  <Button type="button" className="text-[12px] p-0 h-auto border-0 shadow-none bg-transparent hover:bg-transparent text-red-500 hover:underline" variant="destructive">
                      {/* <i className="ri-delete-bin-line  text-[18px] text-red-500"></i> */}
                      Eliminar
                    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Tem certeza desta ação?</AlertDialogTitle>
      <AlertDialogDescription>
        Esta ação é irreversível. Os dados do aluno serão apagados permanentemente.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction onClick={() => deleteHandler(props.alunoID)} className="bg-red-600 hover:bg-red-500">Sim, desejo apagar</AlertDialogAction>
      {/* <Button type="button"
          onClick={(e) => deleteStudent(props.alunoID)}
        className="bg-red-600 hover:bg-red-500">Sim, desejo apagar
       </Button> */}
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
  )
}