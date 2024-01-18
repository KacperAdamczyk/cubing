import { Spinner } from "@nextui-org/spinner";
import { Suspense, type FC, type PropsWithChildren } from "react";

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
