<script lang="ts">
	import type { Algorithm, ViewType } from '$lib/data/types';
	import AlgorithmView from './AlgorithmView.svelte';

	const otherAlgorithmsLimit = 2;

	interface Props {
		class?: string;
		setup: string;
		algorithms: Algorithm[];
		defaultAlgorithmId: string | null;
		slim: boolean;
		viewType: ViewType;
	}

	let {
		class: className = '',
		setup,
		algorithms,
		defaultAlgorithmId,
		slim,
		viewType
	}: Props = $props();

	const mainAlgorithm = $derived(
		algorithms.find((a) => a.id === defaultAlgorithmId) ?? algorithms[0]
	);
	const otherAlgorithms = $derived(algorithms.filter((a) => a.id !== mainAlgorithm?.id));
	const limitedOtherAlgorithms = $derived(
		otherAlgorithms.slice(0, slim ? otherAlgorithmsLimit : otherAlgorithms.length)
	);
	const hasMore = $derived(otherAlgorithms.length > limitedOtherAlgorithms.length);
</script>

<div class={[className, 'flex flex-col gap-2']}>
	<AlgorithmView {setup} algorithm={mainAlgorithm} {slim} {viewType} isMain />
	{#each limitedOtherAlgorithms as algorithm (algorithm.id)}
		<AlgorithmView {setup} {algorithm} {slim} {viewType} />
	{/each}
	{#if hasMore}
		<span
			class="self-center rounded-full border border-base-300 px-2.5 py-0.5 text-xs font-semibold text-base-content/60"
		>
			+{otherAlgorithms.length - limitedOtherAlgorithms.length} more
		</span>
	{/if}
</div>
