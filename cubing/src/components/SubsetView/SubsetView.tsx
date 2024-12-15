import { Link } from "@nextui-org/react";
import { Card, CardBody } from "@nextui-org/card";
import type { FC } from "react";
import { MultiLayer } from "@/components/MultiLayer";
import { Badge } from "@nextui-org/badge";
import type { GetSubsetsEntity } from "@/queries/getSubsets";
import NextLink from "next/link";

interface Props {
  setId: string;
  subset: GetSubsetsEntity;
}

export const SubsetView: FC<Props> = ({ setId, subset }) => (
  <Link as={NextLink} className="block grow" href={`/${setId}/${subset.id}`}>
    <Card>
      <CardBody className="flex flex-col items-center gap-2">
        <Badge placement="bottom-right" size="lg" content={subset.cases.length}>
          <div className="size-20">
            <MultiLayer
              algorithm={subset.previewAlgorithm}
              type={subset.viewType}
            />
          </div>
        </Badge>
        <div className="">{subset.name}</div>
      </CardBody>
    </Card>
  </Link>
);
