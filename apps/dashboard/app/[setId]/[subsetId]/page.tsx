import { CasesList } from "@/components/CasesList";
import { getCasesForSubset } from "@/queries/getCasesForSubset";
import { getSubsets } from "@/queries/getSubsets";
import type { FC } from "react";

export const generateStaticParams = async ({ params: { setId } }: Props) => {
  const subsets = await getSubsets(setId);

  return subsets.map(({ id }) => ({
    subsetId: id,
  }));
};

interface Props {
  params: {
    setId: string;
    subsetId: string;
  };
}

const SubsetPage: FC<Props> = async ({ params }) => {
  const { subsetId } = await params;

  const cases = await getCasesForSubset(subsetId);

  return (
    <div className="mt-2 flex flex-col gap-2">
      <CasesList cases={cases} slim />
    </div>
  );
};

export default SubsetPage;
