import { LastLayer } from "@/components/LastLayer";
import { Link } from "@nextui-org/link";
import type { Subset as SubsetType } from "@repo/db";
import type { FC } from "react";

interface Props {
  subset: SubsetType;
}

export const Subset: FC<Props> = ({ subset }) => (
  <Link className="border-cube-red border-2">
    <LastLayer algorithm={subset.previewAlgorithm} />
    <div>{subset.name}</div>
  </Link>
);
