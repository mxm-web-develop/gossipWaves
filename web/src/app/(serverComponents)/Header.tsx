import { LayoutGrid } from 'lucide-react'
import React from 'react'

async function Header() {
  return (
    <div
      className=' fixed top-0 w-full bg-transparent flex justify-between items-center h-[45px] px-5'
    >
      <div>
        MxM_Ai
      </div>
      <div>

      </div>
      <div>
        <div className='flex items-center justify-end'>
          <LayoutGrid className=' w-[24px] cursor-pointer text-theme-white hover:text-white' />
        </div>
      </div>
    </div>
  )
}

export default Header