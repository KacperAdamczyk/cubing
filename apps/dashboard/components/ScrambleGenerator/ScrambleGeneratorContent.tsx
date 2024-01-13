"use client";
import { Button } from "@nextui-org/button";
import { useCallback, type FC, useState, useEffect } from "react";

interface Props {
  onPip?: (promise: Promise<any> | undefined) => void;
}

export const ScrambleGeneratorContent: FC<Props> = ({ onPip }) => {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported("documentPictureInPicture" in window);
  }, []);

  const onClick = useCallback(() => {
    const promise = (
      globalThis as any
    ).documentPictureInPicture.requestWindow() as Promise<any>;

    onPip?.(promise);
  }, [onPip]);

  return (
    <div>
      <Button
        isDisabled={!isSupported || !onPip}
        onClick={onClick}
        color="primary"
      >
        PIP
      </Button>
    </div>
  );
};
