import type { FC } from "react";
import { AlgorithmView } from "@/components/AlgorithmView";
import { Chip } from "@nextui-org/chip";
import { cn } from "@nextui-org/react";
import type { ViewType } from "src/content.config";
import type { Case } from "@/components/CaseView";

const otherAlgorithmsLimit = 2;

interface Props {
  className?: string;
  setup: string;
  algorithms: Case["algorithms"];
  slim: boolean;
  viewType: ViewType;
}

export const AlgorithmsList: FC<Props> = ({
  className,
  setup,
  algorithms,
  slim,
  viewType,
}) => {
  const [mainAlgorithm, ...otherAlgorithms] = algorithms;
  const limitedOtherAlgorithms = otherAlgorithms.slice(
    0,
    slim ? otherAlgorithmsLimit : otherAlgorithms.length,
  );
  const hasMore = otherAlgorithms.length > limitedOtherAlgorithms.length;

  return (
    <div className={cn(className, "flex flex-col gap-1")}>
      <AlgorithmView
        setup={setup}
        algorithm={mainAlgorithm}
        slim={slim}
        viewType={viewType}
        isMain
      />
      {limitedOtherAlgorithms.map((algorithm) => (
        <AlgorithmView
          key={algorithm.rotations}
          setup={setup}
          algorithm={algorithm}
          slim={slim}
          viewType={viewType}
        />
      ))}
      {hasMore && (
        <Chip className="self-center" color="primary">
          +{otherAlgorithms.length - limitedOtherAlgorithms.length}
        </Chip>
      )}
    </div>
  );
};
