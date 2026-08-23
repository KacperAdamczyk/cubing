<script lang="ts">
	import { Shuffle } from "@lucide/svelte";
	import type { CaseWithContext } from "$lib/data/types";
	import AlgorithmNotation from "./AlgorithmNotation.svelte";
	import AlgorithmsList from "./AlgorithmsList.svelte";
	import CubeView from "./cube/CubeView.svelte";

	interface Props {
		case: CaseWithContext;
		slim: boolean;
		/** Page-level variant: bigger cube and title, `h1` heading. */
		large?: boolean;
	}

	let { case: c, slim, large = false }: Props = $props();

	const viewType = $derived(c.subset.set.viewType);
	const subsetHref = $derived(`/${c.subset.set.cubeId}/${c.subset.setId}/${c.subset.id}`);
</script>

<article
	id={c.id}
	data-type={viewType}
	class="card card-border @container w-full overflow-hidden border-base-300 bg-(--type-tint) shadow-sm transition-shadow group-hover:shadow-lg"
>
	<span class="absolute inset-y-0 left-0 w-1.5 bg-(--type-accent)"></span>
	<div
		class="flex flex-col items-center gap-4 p-4 pl-5 @md:flex-row @md:gap-6 @md:p-5 @md:pl-7 @2xl:gap-8 @2xl:p-6 @2xl:pl-8"
	>
		<div
			class={['shrink-0', large ? 'size-40 @md:size-44 @2xl:size-56' : 'size-28 @md:size-32 @2xl:size-40']}
		>
			<CubeView algorithm={c.setup} type={viewType} />
		</div>
		<div class="flex w-full min-w-0 flex-1 flex-col gap-3">
			<div class="card-title flex-wrap justify-center @md:justify-start">
				<svelte:element
					this={large ? 'h1' : 'h2'}
					class={['font-display font-extrabold tracking-tight', large ? 'text-3xl @2xl:text-4xl' : 'text-2xl']}
				>
					{c.name}
				</svelte:element>
				{#if slim}
					<span class="badge badge-type badge-sm font-bold">{c.subset.name}</span>
				{:else}
					<a
						href={`${subsetHref}#${c.id}`}
						class="badge badge-type badge-sm font-bold transition-opacity hover:opacity-80"
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

			<!-- The setup (scramble) that produces the pictured state: a dashed strip so
			     it reads as "apply this first", not as another alg to learn. -->
			<p
				class="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-field border border-dashed border-base-content/15 px-3 py-2 @md:justify-start"
			>
				<span class="eyebrow flex items-center gap-1.5">
					<Shuffle class="size-3.5" aria-hidden="true" />
					Setup
				</span>
				<AlgorithmNotation notation={c.setup} class="text-sm text-base-content/70" />
			</p>
		</div>
	</div>
</article>
