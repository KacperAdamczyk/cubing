<script lang="ts">
	import { page } from '$app/state';
	import CasesList from '$lib/components/CasesList.svelte';
	import PreviewList from '$lib/components/PreviewList.svelte';
	import { getSubsetView } from '$lib/data/catalog.remote';

	const view = $derived(
		await getSubsetView({ setId: page.params.setId!, subsetId: page.params.subsetId! })
	);
</script>

<PreviewList items={view.items} />
<div class="mt-2 flex flex-col gap-2">
	<CasesList cases={view.cases} slim />
</div>
