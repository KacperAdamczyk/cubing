import { SubsetsList } from "@/components/SubsetsList";
import { getSets } from "@/queries/getSets";
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

const SetLayout: FC<PropsWithChildren<Props>> = ({
  params: { setId },
  children,
}) => (
  <div>
    <SubsetsList setId={setId} />
    {children}
  </div>
);

export default SetLayout;
