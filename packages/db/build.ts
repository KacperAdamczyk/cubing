import dts from "bun-plugin-dts";

await Bun.build({
	entrypoints: ["./index.ts"],
	outdir: "./build",
	target: "bun",
	plugins: [dts()],
});
