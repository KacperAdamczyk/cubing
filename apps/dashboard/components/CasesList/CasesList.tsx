import { CaseView } from "@/components/CaseView";
import type { GetCasesEntity } from "@/queries/getCases";
import NextLink from "next/link";
import type { FC } from "react";
import { Link } from "@nextui-org/link";

interface Props {
  cases: GetCasesEntity[];
  slim: boolean;
}

export const CasesList: FC<Props> = ({ cases, slim }) => (
  <div className="flex flex-col items-center gap-4">
    {cases.map((currentCase) => (
      <Link
        key={currentCase.id}
        as={NextLink}
        className="w-full"
        href={`/case/${currentCase.id}`}
      >
        <CaseView case={currentCase} slim={slim} />
      </Link>
    ))}
    {!cases.length && <div className="text-2xl uppercase">No cases</div>}
  </div>
);
