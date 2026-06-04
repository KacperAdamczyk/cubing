<script lang="ts">
	import { page } from '$app/state';
	import CasesList from '$lib/components/CasesList.svelte';
	import PreviewList from '$lib/components/PreviewList.svelte';
	import { getSetView } from '$lib/data/catalog.remote';

	const view = $derived(await getSetView(page.params.setId!));
</script>

<PreviewList items={view.items} />
<div class="mt-2 flex flex-col gap-2">
	<CasesList cases={view.cases} slim />
</div>
