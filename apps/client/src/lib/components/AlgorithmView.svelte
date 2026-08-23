<script lang="ts">
	import { Lightbulb } from "@lucide/svelte";
	import type { Algorithm, ViewType } from "$lib/data/types";
	import AlgorithmNotation from "./AlgorithmNotation.svelte";
	import AlgorithmVerifier from "./AlgorithmVerifier.svelte";

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
		'flex flex-col rounded-field border',
		isMain ? 'border-(--type-accent)/40 bg-base-200/60 shadow-xs' : 'border-base-300 bg-base-200/30'
	]}
>
	<p class="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 px-3 py-2.5 text-center">
		<AlgorithmNotation
			notation={algorithm.rotations}
			class={isMain ? 'text-lg font-bold @md:text-xl @2xl:text-2xl' : 'text-sm @md:text-base'}
		/>
		<AlgorithmVerifier algorithm={algorithm.rotations} {setup} onlyError={slim} {viewType} />
	</p>
	{#if showMnemonic || showDescription}
		<!-- Notes footer: the hint (mnemonic) and any extra description, left-aligned
		     under a hairline so they read as annotations of the alg above. -->
		<div class="flex flex-col gap-1 border-t border-base-content/10 px-3 py-2 text-left">
			{#if showMnemonic}
				<p class="flex items-start gap-2 text-sm text-base-content/75">
					<Lightbulb class="mt-0.5 size-4 shrink-0 text-(--type-accent)" />
					<span>{algorithm.mnemonics}</span>
				</p>
			{/if}
			{#if showDescription}
				<p class={['text-xs text-base-content/45', showMnemonic && 'pl-6']}>
					{algorithm.description}
				</p>
			{/if}
		</div>
	{/if}
</div>
