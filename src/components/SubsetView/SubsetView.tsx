import { Link } from "@nextui-org/react";
import { Card, CardBody } from "@nextui-org/card";
import { linkWithBase } from "src/helpers/linkWithBase";
import type { FC } from "react";
import { MultiLayer } from "@/components/MultiLayer";
import { Badge } from "@nextui-org/badge";
import type { InferEntrySchema } from "astro:content";

export interface Subset extends InferEntrySchema<"subsets"> {
  cases: InferEntrySchema<"cases">[];
}

interface Props {
  setId: string;
  subset: Subset;
}

export const SubsetView: FC<Props> = ({ setId, subset }) => (
  <Link className="block grow" href={linkWithBase(`/${setId}/${subset.id}`)}>
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
