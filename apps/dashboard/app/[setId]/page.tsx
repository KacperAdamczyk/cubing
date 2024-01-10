import { getSets } from "@/queries/getSets";
import type { FC } from "react";

interface Props {
  params: {
    setId: string;
  };
}

const SetPage: FC<Props> = ({ params: { setId } }) => {
  return (
    <div>
      <h1>Set Page: {setId}</h1>
    </div>
  );
};

export default SetPage;
