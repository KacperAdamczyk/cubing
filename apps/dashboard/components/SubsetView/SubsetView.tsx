import { Link } from "@nextui-org/link";
import { Card, CardBody } from "@nextui-org/card";
import type { Subset } from "@repo/db";
import type { FC } from "react";
import { MultiLayer } from "@/components/MultiLayer";
import { Badge } from "@nextui-org/badge";
import type { GetSubsetsEntity } from "@/queries/getSubsets";

interface Props {
  setId: string;
  subset: GetSubsetsEntity;
}

export const SubsetView: FC<Props> = ({ setId, subset }) => (
  <Link className="block grow" href={`/${setId}/${subset.id}`}>
    <Card>
      <CardBody className="flex flex-col items-center gap-2">
        <Badge placement="bottom-right" size="lg" content={subset.cases.length}>
          <MultiLayer
            algorithm={subset.previewAlgorithm}
            type={subset.viewType}
          />
        </Badge>
        <div className="">{subset.name}</div>
      </CardBody>
    </Card>
  </Link>
);
