import LogoDicampo from '@/app/assets/Dicampo - Logo fondo transparente.png';

export default function Header() {
  return (
    <div className='p-4 text-center'>
        <img className='w-full max-w-[200px] mx-auto' src={LogoDicampo.src} />
    </div>
  )
}
