<script lang="ts">
	import CaseView from '$lib/components/CaseView.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<CaseView case={data.case} slim={false} />
