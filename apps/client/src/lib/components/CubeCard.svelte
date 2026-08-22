<script lang="ts">
	import { ArrowRight } from "@lucide/svelte";
	import { Color } from "cube";
	import { count } from "$lib/data/format";
	import type { CubeSummary } from "$lib/data/types";
	import F2L from "./cube/F2L.svelte";

	interface Props {
		cube: CubeSummary;
	}

	let { cube }: Props = $props();
</script>

<a
	href={cube.href}
	class="group relative flex items-center gap-5 overflow-hidden rounded-box border border-base-300 bg-base-100 p-5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg sm:gap-7 sm:p-6"
>
	<span class="cube-gradient absolute inset-x-0 top-0 h-1"></span>
	<div class="size-28 shrink-0 sm:size-32">
		<F2L algorithm="" maskedColors={[]} orientation={{ U: Color.W, F: Color.G }} />
	</div>
	<div class="flex min-w-0 flex-col gap-2.5">
		<div>
			<h2 class="font-display text-3xl font-extrabold tracking-tight">{cube.name}</h2>
			<p class="text-sm text-base-content/60">
				{count(cube.size, 'case')}
				· {count(cube.sets.length, 'set')}
			</p>
		</div>
		<ul class="flex flex-wrap gap-1.5">
			{#each cube.sets as set (set.id)}
				<li
					data-type={set.viewType}
					class="flex items-center gap-1.5 rounded-full border border-base-300 bg-base-200/70 px-2.5 py-0.5 text-xs font-semibold"
				>
					<span class="size-2 rounded-[2px] bg-(--type-accent)"></span>
					{set.name}
					<span class="text-base-content/50">{set.size}</span>
				</li>
			{/each}
		</ul>
		<span class="inline-flex items-center gap-1 text-sm font-semibold text-primary">
			Browse algorithms
			<ArrowRight class="size-4 transition-transform group-hover:translate-x-0.5" />
		</span>
	</div>
</a>
