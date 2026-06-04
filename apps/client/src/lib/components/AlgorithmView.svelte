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
		'flex flex-col justify-center rounded-md border border-base-300',
		{ 'mb-2 border-2': isMain }
	]}
>
	<span
		class={[
			'flex items-center justify-center gap-1 p-1 text-center',
			isMain ? 'text-2xl font-bold' : 'text-xl'
		]}
	>
		{algorithm.rotations}
		<AlgorithmVerifier algorithm={algorithm.rotations} {setup} onlyError={slim} {viewType} />
	</span>
	{#if showMnemonic}
		<span class="text-center text-lg text-base-content/80">{algorithm.mnemonics}</span>
	{/if}
	{#if showDescription}
		<span class="text-center text-base text-base-content/60">{algorithm.description}</span>
	{/if}
</div>
