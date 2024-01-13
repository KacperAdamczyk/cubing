"use client";
import { ScrambleGeneratorContent } from "@/components/ScrambleGenerator/ScrambleGeneratorContent";
import { use, type FC, useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  onPip: (promise: Promise<any> | undefined) => void;
  pipPromise?: Promise<any>;
}

export const ScrambleGeneratorPip: FC<Props> = ({ onPip, pipPromise }) => {
  const pip = use(pipPromise ?? Promise.resolve());

  useEffect(() => {
    if (!pip) return;

    [...document.styleSheets].forEach((styleSheet) => {
      try {
        const cssRules = [...styleSheet.cssRules]
          .map((rule) => rule.cssText)
          .join("");
        const style = document.createElement("style");

        style.textContent = cssRules;
        pip.document.head.appendChild(style);
      } catch (e) {
        const link = document.createElement("link");

        link.rel = "stylesheet";
        link.type = styleSheet.type;
        link.media = styleSheet.media as any;
        link.href = styleSheet.href as any;
        pip.document.head.appendChild(link);
      }
    });

    pip.addEventListener("pagehide", () => {
      onPip(undefined);
    });
  }, [pip, pipPromise]);

  if (!pip) {
    return null;
  }

  return createPortal(
    <ScrambleGeneratorContent onPip={onPip} />,
    pip.document.body,
  );
};
