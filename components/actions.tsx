"use client"

import React, { useState } from "react"
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { EditStudent } from "./edit-student"
import { deleteStudent } from "@/lib/api"
  

interface IActions {
    id: string;
    name: string;
    email: string;
    parent: string;
}

export default function Actions(props: IActions) {
    const [openDialog, setOpenDialog] = useState(false)
    const [downloading, setDownloading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    
    const deleteHandler = async (id: string | undefined, name: string | undefined) => {
        // const response = await deleteStudent(id);
        try {
          await deleteStudent(id, name)
        } catch (error) {
          console.log(error)
        } finally {
          setTimeout(() => {
            // Recarregar a página inteira
            window.location.reload()
          }, 4000);
        }
      }

  return(
    <React.Fragment>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
          <Button
          variant="link" disabled={downloading} className="flex items-center text-blue-400 text-[13px] px-2"
          >
            <i className="ri-edit-line mr-1 text-[13px]"></i>
            Editar
          </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar</DialogTitle>
            </DialogHeader>
            <EditStudent id={props.id} name={props.name} email={props.email} parent={props.parent} />
          </DialogContent>
        </Dialog>                
                    <AlertDialog>
                    <AlertDialogTrigger>
                <Button type="button" disabled={deleting} variant="link" className="flex items-center text-red-400 text-[13px] px-2">
                  <i className="ri-delete-bin-7-line mr-1 text-[13px]"></i>
                  Remover
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
                  <AlertDialogAction onClick={() => deleteHandler(props.id, props.name)} disabled={deleting} className="text-[13px] bg-red-600 hover:bg-red-500">Sim, desejo apagar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
    </React.Fragment>
  )
}