"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";

export default function Home() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      // Si el usuario no está autenticado, redirige a la página de login
      router.push("/api/auth/login");
    } else {
      // Si el usuario está autenticado, redirige a otra página (por ejemplo, dashboard)
      router.push("/create-client");
    }
  }, [user, isLoading, router]);

  return (
    <div>
      {/* Puedes agregar una pantalla de carga mientras se verifica la autenticación */}
      {isLoading ? <p>Loading...</p> : <p>Redirecting...</p>}
    </div>
  )
}
