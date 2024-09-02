import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "./layout/Layout";
import StoreProvider from "./StoreProvider";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Suspense } from "react";
import Loader from "./components/Loader/Loader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dicampo App Pedidos",
  description: "Aplicación para vendedores Dicampo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-100`}>
        <Suspense fallback={<Loader />}>
          <UserProvider>
            <StoreProvider>
              <Layout>{children}</Layout>
            </StoreProvider>
          </UserProvider>
        </Suspense>
      </body>
    </html>
  );
}
