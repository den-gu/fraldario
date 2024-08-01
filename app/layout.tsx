import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "remixicon/fonts/remixicon.css";
import NavBar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fraldario / Home",
  description: "- A escola que é a escolha.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white`}>
        {children}
      </body>
    </html>
  );
}
