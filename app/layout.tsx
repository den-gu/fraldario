import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "remixicon/fonts/remixicon.css";
import { Toaster } from "sonner";
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import Providers from './providers';

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
      <Toaster 
        toastOptions={{
          classNames: {
            toast: 'bg-white',
            title: 'text-black',
            description: 'text-muted-foreground',
            cancelButton: 'bg-white',
            closeButton: 'bg-white',
          },
          style: {
            border: 'text-zinc-200'
          }
        }}
      />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
