import { CasesList } from "@/components/CasesList";
import { getCasesForSet } from "@/queries/getCasesForSet";
import type { FC } from "react";

interface Props {
  params: Promise<{
    setId: string;
  }>;
}

const SetPage: FC<Props> = async ({ params }) => {
  const { setId } = await params;

  const cases = await getCasesForSet(setId);
  const flatCases = cases.flatMap((currentCase) => currentCase.cases);

  return (
    <div className="mt-2 flex flex-col gap-2">
      <CasesList cases={flatCases} slim />
    </div>
  );
};

export default SetPage;
