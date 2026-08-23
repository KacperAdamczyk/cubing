<script lang="ts">
	import { ArrowLeft, ArrowRight } from "@lucide/svelte";
	import { page } from "$app/state";
	import CaseView from "$lib/components/CaseView.svelte";
	import CubeView from "$lib/components/cube/CubeView.svelte";
	import { getCaseView } from "$lib/data/catalog.remote";

	const view = $derived(await getCaseView(page.params.caseId!));
	const viewType = $derived(view.case.subset.set.viewType);

	const neighborClass =
		"card card-side card-border group items-center gap-3 border-base-300 bg-base-100 p-3 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md";
</script>

<svelte:head>
	<title>{view.case.name} · {view.case.subset.name} · My Cubing Algs</title>
</svelte:head>

<div data-type={viewType} class="flex flex-col gap-6">
	<CaseView case={view.case} slim={false} large />

	<p class="divider my-0 text-xs font-semibold text-base-content/50">
		Case {view.position.index} of {view.position.total} in {view.case.subset.name}
	</p>

	<nav aria-label="Neighbouring cases" class="grid gap-3 sm:grid-cols-2">
		{#if view.prev}
			<a href={view.prev.href} class={[neighborClass, 'pr-4']}>
				<ArrowLeft
					class="size-4 shrink-0 text-base-content/40 transition-transform group-hover:-translate-x-0.5"
				/>
				<div class="size-12 shrink-0">
					<CubeView algorithm={view.prev.setup} type={viewType} />
				</div>
				<div class="min-w-0">
					<p class="eyebrow">Previous</p>
					<p class="font-display truncate text-lg font-bold tracking-tight">{view.prev.name}</p>
				</div>
			</a>
		{/if}
		{#if view.next}
			<a
				href={view.next.href}
				class={[neighborClass, 'justify-end pl-4 text-right sm:col-start-2']}
			>
				<div class="min-w-0">
					<p class="eyebrow">Next</p>
					<p class="font-display truncate text-lg font-bold tracking-tight">{view.next.name}</p>
				</div>
				<div class="size-12 shrink-0">
					<CubeView algorithm={view.next.setup} type={viewType} />
				</div>
				<ArrowRight
					class="size-4 shrink-0 text-base-content/40 transition-transform group-hover:translate-x-0.5"
				/>
			</a>
		{/if}
	</nav>
</div>
