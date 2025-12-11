import { $ } from "bun";
import dts from "bun-plugin-dts";

await $`rm -rf build`;

await Bun.build({
	entrypoints: ["index.ts"],
	outdir: "build",
	target: "browser",
	format: "esm",
	plugins: [dts()],
});
