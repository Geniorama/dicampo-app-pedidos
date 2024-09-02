"use client";

import LogoDicampo from "@/app/assets/Dicampo - Logo fondo transparente.png";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { resetCart } from "@/lib/features/cartSlice";
import { setSelectedClient } from "@/lib/features/clientSlice";
import { useEffect } from "react";

export default function Header() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(state => state.cart)

  useEffect(() => {
    console.log('Items cart', cart)
  }, [cart])

  const handleLogout = (e: any) => {
    e.preventDefault();

    dispatch(resetCart());
    dispatch(setSelectedClient(null));
    window.location.href = "/api/auth/logout";
  };
  return (
    <>
      <div className="p-2 text-center bg-red-500 text-white mb-4">
        <a className="underline" onClick={(e) => handleLogout(e)} href="#">
          Cerrar sesión
        </a>
      </div>
      <div className="p-4 text-center">
        <img className="w-full max-w-[200px] mx-auto" src={LogoDicampo.src} />
      </div>
    </>
  );
}
