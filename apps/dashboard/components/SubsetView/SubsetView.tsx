import { MultiLayer } from "@/components/MultiLayer";
import type { GetSubsetsEntity } from "@/queries/getSubsets";
import { Badge } from "@nextui-org/badge";
import { Card, CardBody } from "@nextui-org/card";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";
import type { FC } from "react";

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
