import { AlgorithmVerifier } from "@/components/AlgorithmVerifier";
import { cn } from "@nextui-org/react";
import type { Algorithm, CaseViewTypes } from "@/db/schema";
import type { FC } from "react";

interface Props {
  setup: string;
  algorithm: Algorithm;
  isMain?: boolean;
  slim: boolean;
  viewType: CaseViewTypes;
}

export const AlgorithmView: FC<Props> = ({
  setup,
  algorithm: { rotations, mnemonic, description },
  isMain,
  slim,
  viewType,
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
        className={cn(
          "flex items-center justify-center gap-1 p-1 text-center",
          {
            "text-xl": !isMain,
            "bold text-2xl": isMain,
          },
        )}
      >
        {rotations}
        <AlgorithmVerifier
          algorithm={rotations}
          setup={setup}
          onlyError={slim}
          viewType={viewType}
        />
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
