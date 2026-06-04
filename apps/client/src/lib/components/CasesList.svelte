<script lang="ts">
	import type { CaseWithContext } from '$lib/data/types';
	import CaseView from './CaseView.svelte';

	interface Props {
		cases: CaseWithContext[];
		slim: boolean;
	}

	let { cases, slim }: Props = $props();
</script>

<div class="flex flex-col gap-4">
	{#each cases as c (c.id)}
		<a
			href={`/${c.subset.setId}/${c.subset.id}/${c.id}`}
			data-type={c.viewType}
			class="group block w-full rounded-box transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--type-accent)"
		>
			<CaseView case={c} {slim} />
		</a>
	{/each}
	{#if cases.length === 0}
		<div
			class="rounded-box border border-dashed border-base-300 p-10 text-center text-base-content/50"
		>
			No cases found.
		</div>
	{/if}
</div>
