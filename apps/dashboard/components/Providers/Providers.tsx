"use client";

import type { FC, PropsWithChildren } from "react";
import { NextUIProvider } from "@nextui-org/react";

export const Providers: FC<PropsWithChildren> = ({ children }) => (
  <NextUIProvider>{children}</NextUIProvider>
);
