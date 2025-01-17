import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  base: process.env.BASE,
  integrations: [react(), tailwind({ applyBaseStyles: false })],
  experimental: {
    contentIntellisense: true,
  },
});
