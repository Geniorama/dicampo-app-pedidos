"use client"

import Link from "next/link";
import { useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { resetCart } from "@/lib/features/cartSlice";
import { setSelectedClient } from "@/lib/features/clientSlice";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

function ThankYou() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const handleCreateNewOrder = () => {
    dispatch(setSelectedClient(null))
    dispatch(resetCart())
    router.push('/create-order')
  };
  return (
    <div className="text-center h-full bg-slate-800 text-white flex items-center flex-col justify-center gap-6 p-4">
      <h1 className="text-3xl font-bold leading-8 text-slate-200">Tu pedido se registró exitosamente</h1>
      <button className=" bg-orange-600 p-2 w-full" onClick={handleCreateNewOrder}>Hacer nuevo pedido</button>
      <a className="text-sm underline" href={"/api/auth/logout"}>Cerrar sesión</a>
    </div>
  );
}

export default withPageAuthRequired(ThankYou)
