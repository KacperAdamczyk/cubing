import { AlgorithmVerifier } from "@/components/AlgorithmVerifier";
import type { Case } from "@/components/CaseView";
import { cn } from "@nextui-org/react";
import type { FC } from "react";
import type { ViewType } from "src/content.config";

interface Props {
  setup: string;
  algorithm: Case["algorithms"][number];
  isMain?: boolean;
  slim: boolean;
  viewType: ViewType;
}

export const AlgorithmView: FC<Props> = ({
  setup,
  algorithm: { rotations, rotationsMnemonic, description },
  isMain,
  slim,
  viewType,
}) => {
  const showMnemonic = (!slim || isMain) && rotationsMnemonic;
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
        <span className="text-center text-lg text-default-600">
          {rotationsMnemonic}
        </span>
      )}
      {showDescription && (
        <span className="text-center text-medium text-default-500">
          {description}
        </span>
      )}
    </div>
  );
};
