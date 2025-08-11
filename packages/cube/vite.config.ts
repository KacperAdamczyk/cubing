import {resolve} from "node:path";
import {defineConfig} from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [tsconfigPaths(), dts()],
    build: {
        lib: {
            entry: resolve(import.meta.dirname, "src/index.ts"),
            name: "Cube",
            fileName: "index",
            formats: ["es"],
        },
    },
});
