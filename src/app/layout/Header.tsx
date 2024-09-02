"use client";

import LogoDicampo from "@/app/assets/Dicampo - Logo fondo transparente.png";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { resetCart } from "@/lib/features/cartSlice";
import { setSelectedClient } from "@/lib/features/clientSlice";

export default function Header() {
  const dispatch = useAppDispatch();

  const handleLogout = (e: any) => {
    e.preventDefault();
    localStorage.removeItem("selectedClient");
    dispatch(resetCart());
    dispatch(setSelectedClient(null));
    window.location.href = "/api/auth/logout";
  };
  return (
    <>
      <div className="py-3 px-2 text-center bg-red-800 text-white mb-4">
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
