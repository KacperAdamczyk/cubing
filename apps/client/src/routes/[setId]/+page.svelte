<script lang="ts">
	import CasesList from '$lib/components/CasesList.svelte';
	import PreviewList from '$lib/components/PreviewList.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<PreviewList items={data.items} />
<div class="mt-2 flex flex-col gap-2">
	<CasesList cases={data.cases} slim />
</div>
