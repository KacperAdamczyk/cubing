<script lang="ts">
	import { ArrowLeft, ArrowRight, Check, ListChecks } from "@lucide/svelte";
	import { browser } from "$app/environment";
	import { page } from "$app/state";
	import TrainingCard from "$lib/components/training/TrainingCard.svelte";
	import { getTrainingTree } from "$lib/data/catalog.remote";
	import {
		flattenTree,
		parseCaseIds,
		parseStep,
		pickerPath,
		resolveEntries,
		sessionPath,
		trainingHref,
	} from "$lib/training/selection";

	const tree = await getTrainingTree();
	const catalogue = flattenTree(tree);

	// Selection and position both come from the URL (see selection.ts). The
	// query isn't readable while prerendering, so the static page shows a
	// placeholder that hydration swaps for the real session.
	const entries = $derived(
		browser ? resolveEntries(catalogue, parseCaseIds(page.url.searchParams)) : [],
	);
	const ids = $derived(entries.map((entry) => entry.case.id));
	const index = $derived(browser ? parseStep(page.url.searchParams, entries.length) : 0);
	const current = $derived(entries.at(index));
	const isLast = $derived(index === entries.length - 1);

	const stepHref = (step: number) => trainingHref(sessionPath, ids, step);
	const pickerHref = $derived(trainingHref(pickerPath, ids));
</script>

<svelte:head>
	<title>
		{current ? `Training ${index + 1} of ${entries.length}` : 'Training'}
		· My Cubing Algs
	</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<header class="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
		<div class="min-w-0">
			<p class="mb-1 text-sm font-semibold text-base-content/55">Practice</p>
			<h1 class="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
				Training session
			</h1>
		</div>
		<a href={pickerHref} class="btn btn-ghost btn-sm">
			<ListChecks class="size-4" aria-hidden="true" />
			Edit selection
		</a>
	</header>

	{#if !browser}
		<div class="skeleton h-80 w-full rounded-box"></div>
	{:else if current}
		{#key current.case.id}
			<TrainingCard entry={current} {index} total={entries.length} />
		{/key}

		<!-- Steps replace the history entry, so Back leaves the session instead
		     of retracing every case; keepfocus lets Enter on "Next" repeat. -->
		<nav
			aria-label="Session steps"
			data-sveltekit-replacestate
			data-sveltekit-keepfocus
			class="flex items-center justify-between gap-3"
		>
			{#if index > 0}
				<a href={stepHref(index - 1)} class="btn">
					<ArrowLeft class="size-4" aria-hidden="true" />
					Previous
				</a>
			{:else}
				<span class="btn btn-disabled" aria-disabled="true">
					<ArrowLeft class="size-4" aria-hidden="true" />
					Previous
				</span>
			{/if}

			<div class="flex min-w-0 flex-1 flex-col items-center gap-1">
				<progress
					class="progress progress-primary w-full max-w-xs"
					value={index + 1}
					max={entries.length}
					aria-label="Session progress"
				></progress>
				<span class="text-xs font-semibold text-base-content/50 tabular-nums">
					{index + 1}
					/ {entries.length}
				</span>
			</div>

			{#if isLast}
				<a href={pickerHref} class="btn btn-primary">
					Finish
					<Check class="size-4" aria-hidden="true" />
				</a>
			{:else}
				<a href={stepHref(index + 1)} class="btn btn-primary">
					Next
					<ArrowRight class="size-4" aria-hidden="true" />
				</a>
			{/if}
		</nav>
	{:else}
		<div class="card card-dash items-center gap-4 border-base-300 p-10 text-center">
			<p class="text-base-content/60">
				No cases selected — pick the ones you want to revise first.
			</p>
			<a href={pickerPath} class="btn btn-primary">
				<ListChecks class="size-4" aria-hidden="true" />
				Pick cases
			</a>
		</div>
	{/if}
</div>
