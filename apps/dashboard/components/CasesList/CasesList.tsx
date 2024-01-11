import { CaseView } from "@/components/CaseView";
import type { GetCasesEntity } from "@/queries/getCases";
import type { FC } from "react";

interface Props {
  cases: GetCasesEntity[];
  slim: boolean;
}

export const CasesList: FC<Props> = ({ cases, slim }) => (
  <div className="flex flex-col items-center gap-4">
    {cases.map((currentCase) => (
      <CaseView key={currentCase.id} case={currentCase} slim={slim} />
    ))}
    {!cases.length && <div className="text-2xl uppercase">No cases</div>}
  </div>
);
