import { CaseView } from "@/components/CaseView";
import { getCase } from "@/queries/getCase";
import { getCases } from "@/queries/getCases";
import { notFound } from "next/navigation";
import type { FC } from "react";

export const generateStaticParams = async () => {
  const cases = await getCases();

  return cases.map((currentCase) => ({ caseId: currentCase.id }));
};

interface Props {
  params: {
    caseId: string;
  };
}

const CasePage: FC<Props> = async ({ params }) => {
  const { caseId } = await params;

  const currentCase = await getCase(caseId);

  if (!currentCase) {
    notFound();
  }

  return <CaseView case={currentCase} slim={false} />;
};

export default CasePage;
