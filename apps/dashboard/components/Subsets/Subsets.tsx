import { Subset } from "@/components/Subset";
import type { Subset as SubsetType } from "@repo/db";
import type { FC } from "react";

interface Props {
  subsets: SubsetType[];
}

export const Subsets: FC<Props> = ({ subsets }) => (
  <div>
    {subsets.map((subset) => (
      <Subset key={subset.id} subset={subset} />
    ))}
  </div>
);
