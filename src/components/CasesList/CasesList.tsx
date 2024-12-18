import { CaseView, type Case } from "@/components/CaseView";
import type { FC } from "react";
import { Link } from "@nextui-org/link";
import { linkWithBase } from "src/helpers/linkWithBase";

interface Props {
  cases: Case[];
  slim: boolean;
}

export const CasesList: FC<Props> = ({ cases, slim }) => (
  <div className="flex flex-col items-center gap-4">
    {cases.map((currentCase) => (
      <Link
        key={currentCase.id}
        className="w-full"
        href={linkWithBase(`/cases/${currentCase.id}`)}
      >
        <CaseView case={currentCase} slim={slim} />
      </Link>
    ))}
    {!cases.length && <div className="text-2xl uppercase">No cases</div>}
  </div>
);
