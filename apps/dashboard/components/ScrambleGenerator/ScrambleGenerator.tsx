"use client";

import { ScrambleGeneratorContent } from "@/components/ScrambleGenerator/ScrambleGeneratorContent";
import { ScrambleGeneratorPip } from "@/components/ScrambleGenerator/ScrambleGeneratorPip";
import { Spinner } from "@nextui-org/spinner";
import { useState, type FC, Suspense } from "react";
import { Scrambow } from "scrambow";

export const ScrambleGenerator: FC = () => {
  const [pipPromise, setPipPromise] = useState<Promise<any>>();
  const [scramblePromise, setScramblePromise] = useState(() =>
    Promise.resolve(new Scrambow().get().at(0)!.scramble_string),
  );

  return (
    <Suspense
      fallback={
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <ScrambleGeneratorContent
        onPip={setPipPromise}
        isPipDisabled={!!pipPromise}
        scramblePromise={scramblePromise}
        onGenerate={setScramblePromise}
      />
      {pipPromise && (
        <ScrambleGeneratorPip
          onPip={setPipPromise}
          pipPromise={pipPromise}
          scramblePromise={scramblePromise}
          onGenerate={setScramblePromise}
        />
      )}
    </Suspense>
  );
};
