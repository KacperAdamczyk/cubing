"use client";

import { ScrambleGeneratorContent } from "@/components/ScrambleGenerator/ScrambleGeneratorContent";
import { ScrambleGeneratorPip } from "@/components/ScrambleGenerator/ScrambleGeneratorPip";
import { useSearchParams } from "next/navigation";
import { useCallback, useState, type FC, Suspense } from "react";

export const ScrambleGenerator: FC = () => {
  const [pipPromise, setPipPromise] = useState<Promise<any>>();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScrambleGeneratorContent onPip={setPipPromise} />
      {pipPromise && (
        <ScrambleGeneratorPip onPip={setPipPromise} pipPromise={pipPromise} />
      )}
    </Suspense>
  );
};
