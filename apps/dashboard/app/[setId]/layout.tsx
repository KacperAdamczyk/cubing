import { Subsets } from "@/components/Subsets";
import { getSets } from "@/queries/getSets";
import { getSubsets } from "@/queries/getSubsets";
import type { FC, PropsWithChildren } from "react";

export const generateStaticParams = async () => {
  const sets = await getSets();

  return sets.map(({ id }) => ({
    setId: id,
  }));
};

interface Props {
  params: {
    setId: string;
  };
}

const SetLayout: FC<PropsWithChildren<Props>> = async ({
  params: { setId },
  children,
}) => {
  const subsets = await getSubsets(setId);

  return (
    <div>
      <Subsets subsets={subsets} />
      {children}
    </div>
  );
};

export default SetLayout;
