import { defineConfig } from "astro/config";
import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  base: process.env.BASE,
  integrations: [react()],
  vite: {
    plugins: [tailwindcss() as never],
  },
});