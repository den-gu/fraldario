

import { endSession } from '@/lib/api'
// import { redirect } from 'next/navigation'
import React from 'react'

export default async function LogOut() {

    // const router = useRouter()
    const response = await endSession();

    // if(response) {
    //   router.push('/')
    // }

    // if(response) {
    //     redirect('/')
    // }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-slate-50">
        <i className="ri-loader-line animate-spin text-[25px] text-black"></i>
    </div>
  )
}
