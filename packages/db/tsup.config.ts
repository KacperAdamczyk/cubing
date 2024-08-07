import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  target: "esnext",
  format: ["esm"],
  dts: true,
  sourcemap: true,
  loader: {
    ".db": "binary",
  },
});
