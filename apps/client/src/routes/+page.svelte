<script lang="ts">
	import CubeCard from "$lib/components/CubeCard.svelte";
	import { getCubesView } from "$lib/data/catalog.remote";

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
</div>
