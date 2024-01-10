import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { FC, PropsWithChildren } from "react";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { cn } from "@nextui-org/react";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cube Algorithms",
  description: "My collection of cube algorithms",
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => (
  <html lang="en">
    <body className={cn(inter.className, "min-w-[430px]")}>
      <Providers>
        <Navbar />
        <main className="max-w-7xl mx-auto pt-4">{children}</main>
      </Providers>
    </body>
  </html>
);

export default RootLayout;
