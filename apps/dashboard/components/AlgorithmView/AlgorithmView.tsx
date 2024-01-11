import { cn } from "@nextui-org/react";
import type { Algorithm } from "@repo/db";
import type { FC } from "react";

interface Props {
  algorithm: Algorithm;
  isMain?: boolean;
  slim: boolean;
}

export const AlgorithmView: FC<Props> = ({
  algorithm: { rotations, mnemonic, description },
  isMain,
  slim,
}) => {
  const showMnemonic = (!slim || isMain) && mnemonic;
  const showDescription = (!slim || isMain) && description;

  return (
    <div
      className={cn(
        "border-divider flex flex-col justify-center rounded-md border",
        {
          "mb-2 border-2": isMain,
        },
      )}
    >
      <span
        className={cn("p-1 text-center", {
          "text-xl": !isMain,
          "bold text-2xl": isMain,
        })}
      >
        {rotations}
      </span>
      {showMnemonic && (
        <span className="text-default-600 text-center text-lg">{mnemonic}</span>
      )}
      {showDescription && (
        <span className="text-medium text-default-500 text-center">
          {description}
        </span>
      )}
    </div>
  );
};
