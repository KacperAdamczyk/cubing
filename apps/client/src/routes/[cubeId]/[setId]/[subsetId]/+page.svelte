<script lang="ts">
	import { page } from "$app/state";
	import CasesList from "$lib/components/CasesList.svelte";
	import PageHeader from "$lib/components/PageHeader.svelte";
	import PreviewList from "$lib/components/PreviewList.svelte";
	import { getSubsetView } from "$lib/data/catalog.remote";
	import { count } from "$lib/data/format";

	const view = $derived(await getSubsetView(page.params.subsetId!));
</script>

<svelte:head>
	<title>{view.subset.name} · {view.set.name} · My Cubing Algs</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader
		eyebrow={`${view.cube.name} · ${view.set.name}`}
		title={view.subset.name}
		stats={[count(view.cases.length, 'case')]}
		viewType={view.set.viewType}
	/>

	<section class="flex flex-col gap-3">
		<h2 class="eyebrow">Subsets</h2>
		<PreviewList items={view.items} />
	</section>

	<section class="flex flex-col gap-3">
		<h2 class="eyebrow">Cases</h2>
		<CasesList cases={view.cases} slim />
	</section>
</div>
