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
import { deleteStudent } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { Toaster, toast } from 'sonner';


interface IDeleteAction {
  id: string;
  name: string;
  class: string;
}

const DeleteAction = (props: IDeleteAction) => {

  const router = useRouter()
  // console.log(props.alunoID)
  // 2. Define a submit handler.
  async function deleteHandler(propId: string, propName: string, propClass: string) {

    try {
      await deleteStudent(propId)
      toast('Sucesso', {
        description: `${propName} foi removido(a) da turma ${propClass}.`,
        duration: 5000,
        cancel: {
          label: 'Fechar',
          onClick: () => console.log('Cancel!'),
        },
      })
      setTimeout(() => {
        // Recarregar a página inteira
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <React.Fragment>
      {/* <Toaster /> */}
      <AlertDialog>
        <AlertDialogTrigger>
          <Button type="button" className="text-[12px] p-0 h-auto border-0 shadow-none bg-transparent hover:bg-transparent text-red-500 hover:underline" variant="destructive">
            {/* <i className="ri-delete-bin-line  text-[18px] text-red-500"></i> */}
            Eliminar
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[16px]">Tem certeza desta ação?</AlertDialogTitle>
            <AlertDialogDescription className="text-[13px]">
              Esta ação é irreversível. Os dados do aluno serão apagados permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="text-[13px]">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteHandler(props.id, props.name, props.class)} className="text-[13px] bg-red-600 hover:bg-red-500">Sim, desejo apagar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  )
}


export default DeleteAction