import { LastLayer } from "@/components/LastLayer";
import { Colors } from "@repo/cube";
import type { FC } from "react";

const HomePage: FC = () => {
  return (
    <div>
      <LastLayer
        algorithm="F R' F' R U2' F R' F' R2' U2' R'"
        maskedColors={[Colors.B, Colors.G, Colors.O, Colors.R, Colors.W]}
      />
      <LastLayer algorithm="R' U' R D' U R2' U R' U R U' R U' R2' D" />
    </div>
  );
};

export default HomePage;
