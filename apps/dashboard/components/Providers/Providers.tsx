"use client";

import type { FC, PropsWithChildren } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  return <NextUIProvider navigate={router.push}>{children}</NextUIProvider>;
};
