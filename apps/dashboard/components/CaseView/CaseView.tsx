import { AlgorithmsList } from "@/components/AlgorithmsList";
import { MultiLayer } from "@/components/MultiLayer";
import type { GetCasesEntity } from "@/queries/getCases";
import { Card, CardBody } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Divider } from "@nextui-org/divider";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import type { FC } from "react";

interface Props {
	case: GetCasesEntity;
	slim: boolean;
}

export const CaseView: FC<Props> = ({
	case: { id, name, algorithms, mainAlgorithmId, setup, subset, viewType },
	slim,
}) => (
	<Card id={id} className="@container border-cube-green w-full target:border-2">
		<CardBody className="@lg:grid-cols-[15rem_1fr] grid grid-cols-[8rem_1fr] grid-rows-[auto_1fr_auto] items-center justify-center gap-2">
			<div className="col-start-1 row-span-2 row-start-1">
				<MultiLayer algorithm={setup} type={viewType} />
			</div>
			<div className="border-divider col-span-2 col-start-1 row-start-3 flex flex-col items-center rounded-md border-2 p-2">
				<div>Setup</div>
				<Divider className="m-2" />
				<span className="text-center">{setup}</span>
			</div>
			<div className="flex items-center justify-center gap-1">
				<span className="text-2xl font-bold">{name}</span>
				{slim ? (
					<Chip color="success">{subset.name}</Chip>
				) : (
					<Link as={NextLink} href={`/${subset.set.id}/${subset.id}#${id}`}>
						<Chip color="success">{subset.name}</Chip>
					</Link>
				)}
			</div>
			<AlgorithmsList
				viewType={viewType}
				className="self-start"
				setup={setup}
				algorithms={algorithms}
				mainAlgorithmId={mainAlgorithmId ?? undefined}
				slim={slim}
			/>
		</CardBody>
	</Card>
);
