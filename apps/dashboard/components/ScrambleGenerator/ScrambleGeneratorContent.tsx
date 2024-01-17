"use client";
import { Button, ButtonGroup } from "@nextui-org/button";
import { useCallback, type FC, useState, useEffect, use } from "react";
import { TbPictureInPictureOn } from "react-icons/tb";
import { randomScrambleForEvent } from "cubing/scramble";
import type { Alg } from "cubing/alg";
import { CubeMesh } from "@/components/CubeMesh";

export interface ScrambleGeneratorContentProps {
  onPip: (promise: Promise<any> | undefined) => void;
  isPipDisabled?: boolean;
  scramblePromise: Promise<Alg>;
  onGenerate: (promise: Promise<Alg>) => void;
}

export const ScrambleGeneratorContent: FC<ScrambleGeneratorContentProps> = ({
  onPip,
  isPipDisabled = false,
  scramblePromise,
  onGenerate,
}) => {
  const [isSupported, setIsSupported] = useState(false);
  const scramble = use(scramblePromise);

  useEffect(() => {
    setIsSupported("documentPictureInPicture" in window);
  }, []);

  const onOpenPip = useCallback(() => {
    const promise = (
      globalThis as any
    ).documentPictureInPicture.requestWindow() as Promise<any>;

    onPip(promise);
  }, [onPip]);

  const onGenerateHandler = useCallback(() => {
    const promise = randomScrambleForEvent("333");

    onGenerate(promise);
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <ButtonGroup color="success">
        <Button onClick={onGenerateHandler}>Generate</Button>
        <Button
          isDisabled={!isSupported || !onPip || isPipDisabled}
          onClick={onOpenPip}
          isIconOnly
        >
          <TbPictureInPictureOn />
        </Button>
      </ButtonGroup>
      <div className="text-2xl">{scramble.toString()}</div>
      <CubeMesh
        algorithm={"D B2 D F2 R2 D F2 D2 R2 F2 R2 U2 B' U' F L2 B' L' F' R B'"}
      />
    </div>
  );
};
