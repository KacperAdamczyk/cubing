import { LastLayer } from "@/components/LastLayer";
import { OLL } from "@/components/OLL";
import type { CaseViewTypes } from "@repo/db";
import type { FC } from "react";

const LayerMap = {
  OLL: OLL,
  PLL: LastLayer,
} satisfies Record<CaseViewTypes, FC<{ algorithm: string }>>;

interface Props {
  algorithm: string;
  type: CaseViewTypes;
}

export const MultiLayer: FC<Props> = ({ algorithm, type }) => {
  const LayerComponent = LayerMap[type];

  return <LayerComponent algorithm={algorithm} />;
};
