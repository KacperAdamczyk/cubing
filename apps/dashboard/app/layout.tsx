import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";

import type { FC, PropsWithChildren } from "react";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { setNodeModulesPath } from "@repo/db";

import "./globals.css";

setNodeModulesPath("../../node_modules");

export const metadata: Metadata = {
  title: "Cube Algorithms",
  description: "My collection of cube algorithms",
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => (
  <html className={GeistMono.className} lang="en">
    <body className="min-w-[430px]">
      <Providers>
        <Navbar />
        <main className="mx-auto max-w-7xl p-2 pt-4">{children}</main>
      </Providers>
    </body>
  </html>
);

export default RootLayout;
