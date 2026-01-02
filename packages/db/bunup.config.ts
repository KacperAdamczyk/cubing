import { defineConfig } from "bunup";

export default defineConfig({
  dts: {
    inferTypes: true,
  },
  exports: true,
  target: "bun",
});
