"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";
import Loader from "../components/Loader/Loader";

export default function Home() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push("/api/auth/login");
    } else {
      router.push("/dashboard/create-client");
    }
  }, [user, isLoading, router]);

  return <Loader />
}
