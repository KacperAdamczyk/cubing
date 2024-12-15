import { AlgorithmsList } from "@/components/AlgorithmsList";
import { MultiLayer } from "@/components/MultiLayer";
import { Card, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Chip } from "@nextui-org/chip";
import type { FC } from "react";
import { Link } from "@nextui-org/link";
import type { InferEntrySchema } from "astro:content";

export interface Case extends InferEntrySchema<"cases"> {
  algorithms: InferEntrySchema<"algorithms">[];
  subset: InferEntrySchema<"subsets"> & { set: InferEntrySchema<"sets"> };
}

interface Props {
  case: Case;
  slim: boolean;
}

export const CaseView: FC<Props> = ({
  case: { id, name, algorithms, mainAlgorithmId, setup, subset, viewType },
  slim,
}) => (
  <Card id={id} className="w-full border-cube-green @container target:border-2">
    <CardBody className="grid grid-cols-[8rem_1fr] grid-rows-[auto_1fr_auto] items-center justify-center gap-2 @lg:grid-cols-[15rem_1fr]">
      <div className="col-start-1 row-span-2 row-start-1">
        <MultiLayer algorithm={setup} type={viewType} />
      </div>
      <div className="col-span-2 col-start-1 row-start-3 flex flex-col items-center rounded-md border-2 border-divider p-2">
        <div>Setup</div>
        <Divider className="m-2" />
        <span className="text-center">{setup}</span>
      </div>
      <div className="flex items-center justify-center gap-1">
        <span className="text-2xl font-bold">{name}</span>
        {slim ? (
          <Chip color="success">{subset.name}</Chip>
        ) : (
          <Link href={`/${subset.set.id}/${subset.id}#${id}`}>
            <Chip color="success">{subset.name}</Chip>
          </Link>
        )}
      </div>
      <AlgorithmsList
        viewType={viewType}
        className="self-start"
        setup={setup}
        algorithms={algorithms}
        mainAlgorithmId={mainAlgorithmId?.id ?? undefined}
        slim={slim}
      />
    </CardBody>
  </Card>
);
