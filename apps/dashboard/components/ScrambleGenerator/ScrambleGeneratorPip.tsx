/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  ScrambleGeneratorContent,
  type ScrambleGeneratorContentProps,
} from "@/components/ScrambleGenerator/ScrambleGeneratorContent";
import { use, type FC, useEffect } from "react";
import { createPortal } from "react-dom";

interface Props extends ScrambleGeneratorContentProps {
  pipPromise?: Promise<any>;
}

export const ScrambleGeneratorPip: FC<Props> = ({ pipPromise, ...props }) => {
  const pip = use(pipPromise ?? Promise.resolve());

  useEffect(() => {
    if (!pip) return;

    [...document.styleSheets].forEach((styleSheet) => {
      const cssRules = [...styleSheet.cssRules]
        .map((rule) => rule.cssText)
        .join("");
      const style = document.createElement("style");

      style.textContent = cssRules;
      pip.document.head.appendChild(style);
    });

    const pageHideHandler = () => {
      props.onPip(undefined);
    };

    pip.addEventListener("pagehide", pageHideHandler);

    return () => pip.removeEventListener("pagehide", pageHideHandler);
  }, [pip, pipPromise, props]);

  if (!pip) {
    return null;
  }

  return createPortal(
    <div className="p-4">
      <ScrambleGeneratorContent {...props} isPipDisabled />
    </div>,
    pip.document.body,
  );
};
