import { Spinner } from "@nextui-org/spinner";
import { type FC, type PropsWithChildren, Suspense } from "react";

const ScrambleLoading: FC<PropsWithChildren> = ({ children }) => (
	<Suspense
		fallback={
			<div className="flex justify-center">
				<Spinner size="lg" />
			</div>
		}
	>
		{children}
	</Suspense>
);

export default ScrambleLoading;
