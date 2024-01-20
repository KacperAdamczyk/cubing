import type { FC } from "react";
import type { Algorithm } from "@repo/db";
import { AlgorithmView } from "@/components/AlgorithmView";
import { Chip } from "@nextui-org/chip";
import { cn } from "@nextui-org/react";

const otherAlgorithmsLimit = 2;

interface Props {
  className?: string;
  setup: string;
  algorithms: Algorithm[];
  mainAlgorithmId?: string;
  slim: boolean;
}

export const AlgorithmsList: FC<Props> = ({
  className,
  setup,
  algorithms,
  mainAlgorithmId,
  slim,
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
          isMain
        />
      ) : (
        <div className="border-cube-red rounded-md border-2 p-1 text-center text-2xl">
          (No main algorithm)
        </div>
      )}
      {limitedOtherAlgorithms.map((algorithm) => (
        <AlgorithmView
          key={algorithm.id}
          setup={setup}
          algorithm={algorithm}
          slim={slim}
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
