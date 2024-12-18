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
  mainAlgorithmId?: string;
  slim: boolean;
  viewType: ViewType;
}

export const AlgorithmsList: FC<Props> = ({
  className,
  setup,
  algorithms,
  mainAlgorithmId,
  slim,
  viewType,
}) => {
  const mainAlgorithm = algorithms.find(
    (algorithm) => algorithm.id === mainAlgorithmId,
  );
  const otherAlgorithms = algorithms.filter(
    (algorithm) => algorithm.id !== mainAlgorithm?.id,
  );
  const limitedOtherAlgorithms = otherAlgorithms.slice(
    0,
    slim ? otherAlgorithmsLimit : otherAlgorithms.length,
  );
  const hasMore = otherAlgorithms.length > limitedOtherAlgorithms.length;

  return (
    <div className={cn(className, "flex flex-col gap-1")}>
      {mainAlgorithm ? (
        <AlgorithmView
          key={mainAlgorithm.id}
          setup={setup}
          algorithm={mainAlgorithm}
          slim={slim}
          viewType={viewType}
          isMain
        />
      ) : (
        <div className="rounded-md border-2 border-cube-red p-1 text-center text-2xl">
          (No main algorithm)
        </div>
      )}
      {limitedOtherAlgorithms.map((algorithm) => (
        <AlgorithmView
          key={algorithm.id}
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
