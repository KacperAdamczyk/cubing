import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      "cube-green": "#009B48",
      "cube-red": "#B90000",
      "cube-blue": "#0045AD",
      "cube-orange": "#FF5900",
      "cube-white": "#FFFFFF",
      "cube-yellow": "#FFD500",
      "cube-blank": "#808080",
    },
  },
  plugins: [
    nextui({
      defaultTheme: "dark",
    }),
  ],
};
export default config;
