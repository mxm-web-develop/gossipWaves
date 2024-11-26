
'use client'

import * as React from "react"
// import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useEffect } from "react";
import { DoorClosed } from "lucide-react";
import { useRouter } from "next/navigation";

interface DialogNavigationProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: any
}

export function DialogNavigation({ open, setOpen, data }: DialogNavigationProps) {
  const router = useRouter()

  // const handleNavigation = (path: string) => {
  //   setOpen(false)
  //   router.push(path)
  // }
  useEffect(() => {
    console.log(data, 'ewfokljfi4j4o2j3oijf32ioj32io0jf32iojoif324jioio')
  }, [])
  const handleNavitemClick = (path: string) => {
    setOpen(false)
    router.push(path)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent className="min-w-[90dvw] rounded-md  border-theme-white/30 text-theme-white w-[90dvw] h-[90%] bg-theme-black/35 backdrop-blur-md backdrop-filter">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
        </VisuallyHidden>
        <div className="navs-container p-2 lg:p-8">
          <div className=" flex flex-col">
            <div>System</div>
            <div className=" px-3  lg:px-5 grid items-center justify-start gap-4 py-4">
              <div onPointerDown={() => handleNavitemClick('/home')} className="relative grid-item w-[75px] h-[75px] p-5 box-border border border-solid 
                 flex items-center justify-center rounded-lg border-theme-white/80 hover:border-white cursor-pointer">
                <div className=" w-full h-full flex-col mb-3 items-center justify-center" >
                  <DoorClosed size={32} strokeWidth={1.25} />
                  <div className=" text-center text-xs">Home</div>
                </div>
              </div>
            </div>
          </div>
        </div>





      </DialogContent>
    </Dialog>
  )
}