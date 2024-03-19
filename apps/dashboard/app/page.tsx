import { SummaryTable } from "@/components/SummaryTable";
import { getCases } from "@/queries/getCases";
import type { FC } from "react";
import { F2L } from "@/components/F2L";

const HomePage: FC = async () => {
  const cases = await getCases();

  return <F2L algorithm={""} />;

  return <SummaryTable cases={cases} />;
};

export default HomePage;
