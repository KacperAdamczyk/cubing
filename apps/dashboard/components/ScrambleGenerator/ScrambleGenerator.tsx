"use client";

import { ScrambleGeneratorContent } from "@/components/ScrambleGenerator/ScrambleGeneratorContent";
import { ScrambleGeneratorPip } from "@/components/ScrambleGenerator/ScrambleGeneratorPip";
import { Spinner } from "@nextui-org/spinner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, type FC, Suspense, useEffect } from "react";
import { Scrambow } from "scrambow";

export const ScrambleGenerator: FC = () => {
  const [pipPromise, setPipPromise] = useState<Promise<any>>();
  const searchParams = useSearchParams();
  const scramble = searchParams.get("s");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (scramble) return;

    const [newScramble] = new Scrambow().get();

    router.push(`${pathname}?s=${newScramble.scramble_string}`);
  }, [scramble, pathname, router]);

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
      />
      {pipPromise && (
        <ScrambleGeneratorPip onPip={setPipPromise} pipPromise={pipPromise} />
      )}
    </Suspense>
  );
};
