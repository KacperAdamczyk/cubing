import { LastLayer } from "@/components/LastLayer";
import { Colors } from "@repo/cube";
import type { FC } from "react";

interface Props {
	algorithm: string;
}

export const OLL: FC<Props> = (props) => (
	<LastLayer
		maskedColors={[Colors.B, Colors.G, Colors.O, Colors.R, Colors.W]}
		{...props}
	/>
);
