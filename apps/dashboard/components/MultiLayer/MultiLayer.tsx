import { OLL } from "@/components/OLL";
import type { CaseViewTypes } from "@repo/db";
import type { FC } from "react";
import { PLL } from "@/components/PLL";
import { F2L } from "@/components/F2L";

const LayerMap = {
  OLL,
  PLL,
  F2L,
} satisfies Record<CaseViewTypes, FC<{ algorithm: string }>>;

interface Props {
  algorithm: string;
  type: CaseViewTypes;
}

export const MultiLayer: FC<Props> = ({ algorithm, type }) => {
  const LayerComponent = LayerMap[type];

  return <LayerComponent algorithm={algorithm} />;
};
