<script lang="ts">
	import type { CaseWithContext } from '$lib/data/types';
	import AlgorithmsList from './AlgorithmsList.svelte';
	import CubeView from './cube/CubeView.svelte';

	interface Props {
		case: CaseWithContext;
		slim: boolean;
	}

	let { case: c, slim }: Props = $props();
</script>

<div id={c.id} class="@container card w-full bg-base-200 p-2">
	<div
		class="card-body grid grid-cols-[8rem_1fr] grid-rows-[auto_1fr_auto] items-center justify-center gap-2 p-2 @lg:grid-cols-[15rem_1fr]"
	>
		<div class="col-start-1 row-span-2 row-start-1">
			<CubeView algorithm={c.setup} type={c.viewType} />
		</div>
		<div
			class="col-span-2 col-start-1 row-start-3 flex flex-col items-center rounded-md border-2 border-base-300 p-2"
		>
			<div>Setup</div>
			<div class="divider my-1"></div>
			<span class="text-center">{c.setup}</span>
		</div>
		<div class="flex items-center justify-center gap-1">
			<span class="text-2xl font-bold">{c.name}</span>
			{#if slim}
				<span class="badge">{c.subset.name}</span>
			{:else}
				<a href={`/${c.subset.setId}/${c.subset.id}#${c.id}`}>
					<span class="badge">{c.subset.name}</span>
				</a>
			{/if}
		</div>
		<AlgorithmsList
			class="self-start"
			viewType={c.viewType}
			setup={c.setup}
			algorithms={c.algorithms}
			{slim}
		/>
	</div>
</div>
