import { AlgorithmsList } from "@/components/AlgorithmsList";
import { MultiLayer } from "@/components/MultiLayer";
import type { GetCasesEntity } from "@/queries/getCases";
import { Card, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import type { FC } from "react";

interface Props {
  case: GetCasesEntity;
  slim: boolean;
}

export const CaseView: FC<Props> = ({
  case: { name, algorithms, setup, subset, viewType },
  slim,
}) => (
  <Card className="@container w-full">
    <CardBody className="@lg:grid-cols-[15rem_1fr] grid grid-cols-[8rem_1fr] grid-rows-[auto_1fr_auto] items-center justify-center gap-2">
      <div className="col-start-1 row-span-2 row-start-1">
        <MultiLayer algorithm={setup} type={viewType} />
      </div>
      <div className="border-divider col-span-2 col-start-1 row-start-3 flex flex-col items-center rounded-md border-2 p-2">
        <div>Setup</div>
        <Divider className="m-2" />
        <span className="text-center">{setup}</span>
      </div>
      <div className="flex justify-center gap-1">
        <span className="text-2xl font-bold">{name}</span>
        <span className="text-2xl">[{subset.name}]</span>
      </div>
      <AlgorithmsList setup={setup} algorithms={algorithms} slim={slim} />
    </CardBody>
  </Card>
);
