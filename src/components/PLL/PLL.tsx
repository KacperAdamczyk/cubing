import type { FC } from "react";
import { LastLayer } from "@/components/LastLayer";

interface Props {
  algorithm: string;
}

export const PLL: FC<Props> = ({ algorithm }) => {
  return <LastLayer algorithm={algorithm} />;
};
