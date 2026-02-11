import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TerraWatt",
  description: "Global Energy Transition Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow container mx-auto p-4 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
