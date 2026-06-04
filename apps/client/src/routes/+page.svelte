<script lang="ts">
	import CasesList from '$lib/components/CasesList.svelte';
	import PreviewList from '$lib/components/PreviewList.svelte';
	import { getHomeView } from '$lib/data/catalog.remote';

	const view = await getHomeView();
</script>

<PreviewList items={view.items} />
<div class="mt-2 flex flex-col gap-2">
	<CasesList cases={view.cases} slim />
</div>
