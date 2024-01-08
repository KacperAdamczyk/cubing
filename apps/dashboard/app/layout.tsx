import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { FC, PropsWithChildren } from "react";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";

import "./globals.css";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cube Algorithms",
  description: "My collection of cube algorithms",
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => (
  <html lang="en">
    <body className={clsx(inter.className, "min-w-[430px]")}>
      <Providers>
        <Navbar />
        {children}
      </Providers>
    </body>
  </html>
);

export default RootLayout;
