<script lang="ts">
	import { page } from "$app/state";
	import CasesList from "$lib/components/CasesList.svelte";
	import PageHeader from "$lib/components/PageHeader.svelte";
	import PreviewList from "$lib/components/PreviewList.svelte";
	import { getCubeView } from "$lib/data/catalog.remote";
	import { count } from "$lib/data/format";

	const view = $derived(await getCubeView(page.params.cubeId!));
</script>

<svelte:head>
	<title>{view.cube.name} · My Cubing Algs</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader
		title={view.cube.name}
		description="Every algorithm for this cube, grouped by set and subset."
		stats={[count(view.cases.length, 'case'), count(view.sets.length, 'set')]}
	/>

	<section class="flex flex-col gap-3">
		<h2 class="eyebrow">Sets</h2>
		<PreviewList items={view.items} />
	</section>

	<section class="flex flex-col gap-3">
		<h2 class="eyebrow">Cases</h2>
		<CasesList cases={view.cases} slim />
	</section>
</div>
