<script lang="ts">
	import { page } from '$app/state';
	import CaseView from '$lib/components/CaseView.svelte';
	import { getCaseView } from '$lib/data/catalog.remote';

	const currentCase = $derived(await getCaseView(page.params.caseId));
</script>

<CaseView case={currentCase} slim={false} />
