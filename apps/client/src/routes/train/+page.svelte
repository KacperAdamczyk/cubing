<script lang="ts">
	import { Play } from "@lucide/svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import PageHeader from "$lib/components/PageHeader.svelte";
	import SelectionTree from "$lib/components/training/SelectionTree.svelte";
	import { getTrainingTree } from "$lib/data/catalog.remote";
	import { count } from "$lib/data/format";
	import {
		flattenTree,
		parseCaseIds,
		pickerPath,
		sessionPath,
		toggleIds,
		trainingHref,
	} from "$lib/training/selection";

	const tree = await getTrainingTree();
	// Every case id in catalogue order — the canonical order of a selection.
	const order = flattenTree(tree).map((entry) => entry.case.id);

	// The selection is the `?cases=` query (see selection.ts); this route is
	// rendered dynamically, so the server response already has the right boxes
	// ticked. Every change is written straight back to the URL (replacing the
	// history entry) so the picker has no state of its own.
	const ids = $derived(parseCaseIds(page.url.searchParams));
	const selected = $derived(new Set(order.filter((id) => ids.includes(id))));

	const update = (next: string[]) =>
		goto(trainingHref(pickerPath, next), { replaceState: true, noScroll: true, keepFocus: true });
	const toggle = (groupIds: string[], checked: boolean) =>
		update(toggleIds(order, selected, groupIds, checked));

	const startHref = $derived(trainingHref(sessionPath, [...selected]));
</script>

<svelte:head>
	<title>Training · My Cubing Algs</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader
		eyebrow="Practice"
		title="Algorithm training"
		description="Tick the cases you want to revise, then go through them one at a time: set up the cube, recall the alg and reveal the solution to check yourself."
		stats={[`${count(selected.size, 'case')} selected`]}
	/>

	<section class="card card-border border-base-300 bg-base-100 shadow-sm">
		<header
			class="flex flex-wrap items-center justify-between gap-2 border-b border-base-300 px-4 py-2.5"
		>
			<h2 class="eyebrow">Cases</h2>
			<div class="flex gap-1">
				<button
					type="button"
					class="btn btn-ghost btn-xs"
					disabled={selected.size === order.length}
					onclick={() => update(order)}
				>
					Select all
				</button>
				<button
					type="button"
					class="btn btn-ghost btn-xs"
					disabled={selected.size === 0}
					onclick={() => update([])}
				>
					Clear
				</button>
			</div>
		</header>
		<div class="p-2 sm:p-3">
			<SelectionTree {tree} {selected} ontoggle={toggle} />
		</div>
	</section>

	<!-- Sticks to the bottom of the viewport while the tree scrolls past. -->
	<div
		class="sticky bottom-4 z-10 flex items-center justify-between gap-3 rounded-box border border-base-300 bg-base-100/90 p-3 pl-4 shadow-lg backdrop-blur-md"
	>
		<p class="text-sm font-semibold text-base-content/70">
			{#if selected.size > 0}
				{count(selected.size, 'case')}
				selected
			{:else}
				Nothing selected yet
			{/if}
		</p>
		{#if selected.size > 0}
			<a href={startHref} class="btn btn-primary">
				<Play class="size-4" aria-hidden="true" />
				Start training
			</a>
		{:else}
			<span class="btn btn-disabled" aria-disabled="true">
				<Play class="size-4" aria-hidden="true" />
				Start training
			</span>
		{/if}
	</div>
</div>
