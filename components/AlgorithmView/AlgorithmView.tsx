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
        "flex flex-col justify-center rounded-md border border-divider",
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
        <span className="text-center text-lg text-default-600">{mnemonic}</span>
      )}
      {showDescription && (
        <span className="text-center text-medium text-default-500">
          {description}
        </span>
      )}
    </div>
  );
};
