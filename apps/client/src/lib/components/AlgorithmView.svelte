<script lang="ts">
	import type { Algorithm, ViewType } from '$lib/data/types';
	import AlgorithmVerifier from './AlgorithmVerifier.svelte';

	interface Props {
		setup: string;
		algorithm: Algorithm;
		isMain?: boolean;
		slim: boolean;
		viewType: ViewType;
	}

	let { setup, algorithm, isMain = false, slim, viewType }: Props = $props();

	const showMnemonic = $derived((!slim || isMain) && algorithm.mnemonics);
	const showDescription = $derived((!slim || isMain) && algorithm.description);
</script>

<div
	class={[
		'flex flex-col gap-1 rounded-field border px-3 py-2 text-center',
		isMain ? 'border-(--type-accent)/35 bg-base-200/60' : 'border-base-300 bg-base-200/30'
	]}
>
	<span
		class={[
			'flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 font-mono tracking-wide',
			isMain ? 'text-xl font-bold sm:text-2xl' : 'text-base sm:text-lg'
		]}
	>
		{algorithm.rotations}
		<AlgorithmVerifier algorithm={algorithm.rotations} {setup} onlyError={slim} {viewType} />
	</span>
	{#if showMnemonic}
		<span class="text-sm text-base-content/75 italic">{algorithm.mnemonics}</span>
	{/if}
	{#if showDescription}
		<span class="text-xs text-base-content/55">{algorithm.description}</span>
	{/if}
</div>
