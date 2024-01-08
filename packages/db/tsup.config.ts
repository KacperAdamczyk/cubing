import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  target: "esnext",
  format: ["esm"],
  dts: true,
  clean: true,
  external: ["bun:sqlite"],
  loader: {
    ".db": "binary",
  },
});
