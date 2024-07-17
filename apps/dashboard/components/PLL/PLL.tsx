import { LastLayer } from "@/components/LastLayer";
import type { FC } from "react";

interface Props {
	algorithm: string;
}

export const PLL: FC<Props> = ({ algorithm }) => {
	return <LastLayer algorithm={algorithm} />;
};
