import { SubsetView } from "@/components/SubsetView";
import { getSubsets, type GetSubsetsEntity } from "@/queries/getSubsets";
import { CaseViewTypes } from "@/db/schema";
import type { FC } from "react";

interface Props {
  setId: string;
}

export const SubsetsList: FC<Props> = async ({ setId }) => {
  const subsets = await getSubsets(setId);

  const allCases = subsets.flatMap(({ cases }) => cases);
  const allSubset = {
    id: "",
    name: "All",
    previewAlgorithm: "",
    setId,
    viewType: subsets.at(0)?.viewType ?? CaseViewTypes.PLL,
    cases: allCases,
  } satisfies GetSubsetsEntity;

  return (
    <div className="flex flex-wrap gap-4">
      <SubsetView key="all" setId={setId} subset={allSubset} />
      {subsets.map((subset) => (
        <SubsetView key={subset.id} setId={setId} subset={subset} />
      ))}
    </div>
  );
};
