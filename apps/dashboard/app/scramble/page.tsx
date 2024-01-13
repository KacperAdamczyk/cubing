import { ScrambleGenerator } from "@/components/ScrambleGenerator";
import { Suspense, type FC } from "react";

const ScramblePage: FC = () => {
  return (
    <Suspense fallback={<div>Loading....</div>}>
      <ScrambleGenerator />
    </Suspense>
  );
};

export default ScramblePage;
