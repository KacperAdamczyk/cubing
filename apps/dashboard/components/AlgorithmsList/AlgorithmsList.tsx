import type { FC } from "react";
import type { Algorithm } from "@repo/db";
import { AlgorithmView } from "@/components/AlgorithmView";
import { Chip } from "@nextui-org/chip";

const otherAlgorithmsLimit = 2;

interface Props {
  algorithms: Algorithm[];
  slim: boolean;
}

export const AlgorithmsList: FC<Props> = ({ algorithms, slim }) => {
  const mainAlgorithm = algorithms.find((algorithm) => algorithm.isMain);
  const otherAlgorithms = algorithms.filter(
    (algorithm) => algorithm.id !== mainAlgorithm?.id,
  );
  const limitedOtherAlgorithms = otherAlgorithms.slice(0, otherAlgorithmsLimit);
  const hasMore = otherAlgorithms.length > limitedOtherAlgorithms.length;

  return (
    <div className="flex flex-col gap-1">
      {mainAlgorithm ? (
        <AlgorithmView
          key={mainAlgorithm.id}
          algorithm={mainAlgorithm}
          slim={slim}
          isMain
        />
      ) : (
        <div className="border-cube-red rounded-md border-2 p-1 text-center text-2xl">
          (No main algorithm)
        </div>
      )}
      {!!mainAlgorithm &&
        limitedOtherAlgorithms.map((algorithm) => (
          <AlgorithmView key={algorithm.id} algorithm={algorithm} slim={slim} />
        ))}
      {hasMore && (
        <Chip className="self-center" color="primary">
          +{otherAlgorithms.length - limitedOtherAlgorithms.length}
        </Chip>
      )}
    </div>
  );
};
