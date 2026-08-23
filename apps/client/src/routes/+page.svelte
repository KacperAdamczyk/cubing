<script lang="ts">
	import { ArrowRight, Dumbbell } from "@lucide/svelte";
	import CubeCard from "$lib/components/CubeCard.svelte";
	import { getCubesView } from "$lib/data/catalog.remote";
	import { pickerPath } from "$lib/training/selection";

	const cubes = await getCubesView();
</script>

<svelte:head>
	<title>My Cubing Algs</title>
</svelte:head>

<div class="flex flex-col gap-10">
	<section class="pt-2 sm:pt-6">
		<p class="eyebrow mb-2">Personal algorithm sheet</p>
		<h1 class="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">My Cubing Algs</h1>
		<p class="mt-3 max-w-xl text-base text-base-content/65">
			A personal collection of speedcubing algorithms — every case with its setup moves, alternative
			algs and a built-in correctness check. Pick a cube to start.
		</p>
	</section>

	<section class="flex flex-col gap-3">
		<h2 class="eyebrow">Cubes</h2>
		<div class="grid gap-4 md:grid-cols-2">
			{#each cubes as cube (cube.id)}
				<CubeCard {cube} />
			{/each}
		</div>
	</section>

	<section class="flex flex-col gap-3">
		<h2 class="eyebrow">Practice</h2>
		<a
			href={pickerPath}
			class="card card-side card-border group items-center overflow-hidden border-base-300 bg-base-100 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg md:max-w-[calc(50%-0.5rem)]"
		>
			<div
				class="ml-5 flex size-16 shrink-0 items-center justify-center rounded-box bg-primary/10 text-primary sm:ml-6"
			>
				<Dumbbell class="size-8" aria-hidden="true" />
			</div>
			<div class="card-body min-w-0 gap-1.5 p-5 sm:p-6">
				<h3 class="card-title font-display text-2xl font-extrabold tracking-tight">
					Algorithm training
				</h3>
				<p class="text-sm text-base-content/60">
					Pick the cases you want to revise and drill them one by one — set up, recall, reveal.
				</p>
				<span class="inline-flex items-center gap-1 text-sm font-semibold text-primary">
					Start training
					<ArrowRight class="size-4 transition-transform group-hover:translate-x-0.5" />
				</span>
			</div>
		</a>
	</section>
</div>
