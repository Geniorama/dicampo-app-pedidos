import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "./layout/Layout";
import StoreProvider from "./StoreProvider";
import { UserProvider } from "@auth0/nextjs-auth0/client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-100`}>
        <UserProvider>
          <StoreProvider>
            <Layout>{children}</Layout>
          </StoreProvider>
        </UserProvider>
      </body>
    </html>
  );
}
