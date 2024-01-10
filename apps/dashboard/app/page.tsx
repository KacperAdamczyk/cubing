import { LastLayer } from "@/components/LastLayer";
import { Colors } from "@repo/cube";
<<<<<<< Updated upstream

export default function Home() {
  return (
    <main>
=======
import type { FC } from "react";

const HomePage: FC = () => {
  return (
    <div>
>>>>>>> Stashed changes
      <LastLayer
        algorithm="F R' F' R U2' F R' F' R2' U2' R'"
        maskedColors={[Colors.B, Colors.G, Colors.O, Colors.R, Colors.W]}
      />
      <LastLayer algorithm="R' U' R D' U R2' U R' U R U' R U' R2' D" />
<<<<<<< Updated upstream
    </main>
=======
    </div>
>>>>>>> Stashed changes
  );
};

export default HomePage;
