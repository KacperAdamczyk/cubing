<script lang="ts">
	import type { CaseWithContext } from '$lib/data/types';
	import CaseView from './CaseView.svelte';

	interface Props {
		cases: CaseWithContext[];
		slim: boolean;
	}

	let { cases, slim }: Props = $props();
</script>

<div class="flex flex-col items-center gap-4">
	{#each cases as c (c.id)}
		<a class="w-full" href={`/${c.subset.setId}/${c.subset.id}/${c.id}`}>
			<CaseView case={c} {slim} />
		</a>
	{/each}
	{#if cases.length === 0}
		<div class="text-2xl uppercase">No cases</div>
	{/if}
</div>
