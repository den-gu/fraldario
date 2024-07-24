import * as React from "react"
 
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@react-hook/media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export function AddUser() {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")
   
    if (isDesktop) {
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
          <Button
            variant="outline"
            className="hidden sm:flex items-center h-10 gap-1"
          >
            <i className="ri-sticky-note-add-line"></i>
            {/* <i className="ri-add-line text-[14px] font-thin"></i> */}
            Adicionar
          </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Novo aluno</DialogTitle>
              {/* <DialogDescription>
                Make changes to your profile here. Click save when you are done.
              </DialogDescription> */}
            </DialogHeader>
            <CreateUserForm />
          </DialogContent>
        </Dialog>
      )
    }
   
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
        <Button
            variant="outline"
            className="items-center h-10 gap-1"
          >
            <i className="ri-sticky-note-add-line"></i>
            {/* <i className="ri-add-line text-[14px] font-thin"></i> */}
            Adicionar
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Edit profile</DrawerTitle>
            {/* <DrawerDescription>
              Make changes to your profile here. Click save when you are done.
            </DrawerDescription> */}
          </DrawerHeader>
          <CreateUserForm className="px-4" />
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

function CreateUserForm({ className }: React.ComponentProps<"form">) {
    return (
      <form className={cn("grid items-start gap-4", className)}>
        <div className="grid gap-2">
          <Label htmlFor="email">Nome</Label>
          <Input type="text" id="name" placeholder="" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" defaultValue="" />
        </div>
        <Button type="submit">Adicionar</Button>
      </form>
    )
  }