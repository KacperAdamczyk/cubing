import { OLL } from "@/components/OLL";
import type { FC } from "react";
import { PLL } from "@/components/PLL";
import { F2L } from "@/components/F2L";
import type { ViewType } from "src/content.config";

const LayerMap = {
  OLL,
  PLL,
  F2L,
} satisfies Record<ViewType, FC<{ algorithm: string }>>;

interface Props {
  algorithm: string;
  type: keyof typeof LayerMap;
}

export const MultiLayer: FC<Props> = ({ algorithm, type }) => {
  const LayerComponent = LayerMap[type];

  return <LayerComponent algorithm={algorithm} />;
};
