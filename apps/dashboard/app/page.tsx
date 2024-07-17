import { SummaryTable } from "@/components/SummaryTable";
import { getCases } from "@/queries/getCases";
import type { FC } from "react";

const HomePage: FC = async () => {
	const cases = await getCases();

	return <SummaryTable cases={cases} />;
};

export default HomePage;
