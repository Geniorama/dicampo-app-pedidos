import React from 'react'
import FruitsAnimation from '@/app/assets/orange.gif'

export default function Loader() {
  return (
    <div className='fixed top-0 left-0 w-screen h-screen bg-white z-50 flex justify-center items-center flex-col overflow-hidden text-center'>
      <img className='w-[200px]' src={FruitsAnimation.src} alt="" />
      <span className=' font-medium text-slate-600'>Cargando ...</span>
    </div>
  )
}
