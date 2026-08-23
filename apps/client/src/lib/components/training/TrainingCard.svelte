<script lang="ts">
	import { Eye, Shuffle } from "@lucide/svelte";
	import type { TrainingEntry } from "$lib/data/types";
	import AlgorithmNotation from "../AlgorithmNotation.svelte";
	import AlgorithmsList from "../AlgorithmsList.svelte";
	import CubeView from "../cube/CubeView.svelte";

	interface Props {
		entry: TrainingEntry;
		/** 0-based position in the session, for the "n / total" marker. */
		index: number;
		total: number;
	}

	let { entry, index, total }: Props = $props();

	// Hidden by default: the picture and the setup are the prompt, the name and
	// the algs are the answer (a name like "Sune" would give the alg away).
	let revealed = $state(false);

	const viewType = $derived(entry.set.viewType);
</script>

<article
	data-type={viewType}
	class="card card-border @container relative w-full overflow-hidden border-base-300 bg-(--type-tint) shadow-sm"
>
	<span class="absolute inset-y-0 left-0 w-1.5 bg-(--type-accent)"></span>
	<div class="flex flex-col gap-5 p-4 pl-6 @md:p-6 @md:pl-8">
		<header class="flex flex-wrap items-center gap-2">
			<span class="badge badge-type badge-sm font-bold">{entry.set.name}</span>
			<span class="badge badge-ghost badge-sm font-semibold">{entry.subset.name}</span>
			<span class="ml-auto text-sm font-semibold text-base-content/50 tabular-nums">
				{index + 1}
				/ {total}
			</span>
		</header>

		<div class="flex flex-col items-center gap-5 @md:flex-row @md:items-start @md:gap-8">
			<div class="size-44 shrink-0 @md:size-52 @2xl:size-60">
				<CubeView algorithm={entry.case.setup} type={viewType} />
			</div>

			<div class="flex w-full min-w-0 flex-1 flex-col gap-4">
				<!-- The scramble that produces the pictured state — apply it first. -->
				<p
					class="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-field border border-dashed border-base-content/15 px-3 py-2 @md:justify-start"
				>
					<span class="eyebrow flex items-center gap-1.5">
						<Shuffle class="size-3.5" aria-hidden="true" />
						Setup
					</span>
					<AlgorithmNotation notation={entry.case.setup} class="text-base text-base-content/80" />
				</p>

				{#if revealed}
					<div class="flex flex-col gap-3">
						<h2
							class="font-display text-center text-2xl font-extrabold tracking-tight @md:text-left @2xl:text-3xl"
						>
							{entry.case.name}
						</h2>
						<AlgorithmsList
							{viewType}
							setup={entry.case.setup}
							algorithms={entry.case.algorithms}
							defaultAlgorithmId={entry.case.defaultAlgorithmId}
							slim={false}
						/>
					</div>
				{:else}
					<div
						class="card card-dash flex-1 items-center justify-center gap-3 border-base-content/20 px-4 py-8 text-center"
					>
						<button type="button" class="btn btn-primary" onclick={() => (revealed = true)}>
							<Eye class="size-4" aria-hidden="true" />
							Reveal solution
						</button>
						<p class="text-xs text-base-content/55">
							Set up the case, recall the alg, then check yourself.
						</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</article>
