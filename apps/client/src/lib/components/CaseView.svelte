<script lang="ts">
	import type { CaseWithContext } from '$lib/data/types';
	import AlgorithmsList from './AlgorithmsList.svelte';
	import CubeView from './cube/CubeView.svelte';

	interface Props {
		case: CaseWithContext;
		slim: boolean;
	}

	let { case: c, slim }: Props = $props();

	const viewType = $derived(c.subset.set.viewType);
</script>

<article
	id={c.id}
	data-type={viewType}
	class="@container relative w-full overflow-hidden rounded-box border border-base-300 bg-(--type-tint) shadow-sm transition-shadow group-hover:shadow-lg"
>
	<span class="absolute inset-y-0 left-0 w-1.5 bg-(--type-accent)"></span>
	<div class="flex items-center gap-4 p-4 pl-5 @lg:gap-6 @lg:p-6 @lg:pl-7">
		<div class="size-28 shrink-0 @lg:size-40">
			<CubeView algorithm={c.setup} type={viewType} />
		</div>
		<div class="flex min-w-0 flex-1 flex-col gap-3">
			<div class="flex flex-wrap items-center gap-2">
				<h2 class="text-2xl font-extrabold tracking-tight">{c.name}</h2>
				{#if slim}
					<span
						class="rounded-full bg-(--type-pill) px-2.5 py-0.5 text-xs font-bold text-(--type-pill-content)"
					>
						{c.subset.name}
					</span>
				{:else}
					<a
						href={`/${c.subset.set.cubeId}/${c.subset.setId}/${c.subset.id}#${c.id}`}
						class="rounded-full bg-(--type-pill) px-2.5 py-0.5 text-xs font-bold text-(--type-pill-content) transition-opacity hover:opacity-80"
					>
						{c.subset.name}
					</a>
				{/if}
			</div>

			<AlgorithmsList
				{viewType}
				setup={c.setup}
				algorithms={c.algorithms}
				defaultAlgorithmId={c.defaultAlgorithmId}
				{slim}
			/>

			<p class="flex flex-wrap items-baseline gap-x-2 text-xs text-base-content/55">
				<span class="font-bold tracking-wide text-base-content/45 uppercase">Setup</span>
				<span class="font-mono">{c.setup}</span>
			</p>
		</div>
	</div>
</article>
