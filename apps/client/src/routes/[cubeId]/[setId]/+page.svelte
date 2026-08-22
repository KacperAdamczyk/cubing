<script lang="ts">
	import { page } from "$app/state";
	import CasesList from "$lib/components/CasesList.svelte";
	import PageHeader from "$lib/components/PageHeader.svelte";
	import PreviewList from "$lib/components/PreviewList.svelte";
	import { getSetView } from "$lib/data/catalog.remote";
	import { count } from "$lib/data/format";
	import { viewTypeInfo } from "$lib/data/viewTypes";

	const view = $derived(await getSetView(page.params.setId!));
	const info = $derived(viewTypeInfo[view.set.viewType]);
</script>

<svelte:head>
	<title>{view.set.name} · {view.cube.name} · My Cubing Algs</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader
		eyebrow={`${view.cube.name} · ${info.label}`}
		title={view.set.name}
		description={info.description}
		stats={[count(view.cases.length, 'case'), count(view.subsets.length, 'subset')]}
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
