<script lang="ts">
	import { count } from "$lib/data/format";
	import type { CaseWithContext } from "$lib/data/types";
	import CaseView from "./CaseView.svelte";

	interface Props {
		cases: CaseWithContext[];
		slim: boolean;
	}

	let { cases, slim }: Props = $props();

	type Subset = CaseWithContext["subset"];

	// Group cases by subset so long lists (a whole set or cube) get scannable
	// section headers; a single-subset list renders without them.
	const groups = $derived.by(() => {
		const bySubset = new Map<string, { subset: Subset; cases: CaseWithContext[] }>();
		for (const c of cases) {
			const group = bySubset.get(c.subset.id) ?? { subset: c.subset, cases: [] };
			group.cases.push(c);
			bySubset.set(c.subset.id, group);
		}
		return bySubset.values().toArray();
	});
	const showHeaders = $derived(groups.length > 1);
	const showSetNames = $derived(new Set(cases.map((c) => c.subset.setId)).size > 1);

	const subsetHref = (subset: Subset) => `/${subset.set.cubeId}/${subset.setId}/${subset.id}`;
	const caseHref = (c: CaseWithContext) => `${subsetHref(c.subset)}/${c.id}`;
</script>

<div class="flex flex-col gap-8">
	{#each groups as group (group.subset.id)}
		<section data-type={group.subset.set.viewType} class="flex flex-col gap-3">
			{#if showHeaders}
				<header
					class="sticky top-16 z-10 -mx-1 flex items-center gap-2.5 rounded-field bg-base-200/85 px-2 py-1.5 backdrop-blur-md"
				>
					<span class="size-2.5 shrink-0 rounded-[3px] bg-(--type-accent)"></span>
					<h2 class="font-display text-lg font-bold tracking-tight">
						<a href={subsetHref(group.subset)} class="link link-hover">{group.subset.name}</a>
					</h2>
					{#if showSetNames}
						<span class="badge badge-type badge-sm font-bold">{group.subset.set.name}</span>
					{/if}
					<span class="ml-auto text-xs font-semibold text-base-content/50">
						{count(group.cases.length, 'case')}
					</span>
				</header>
			{/if}
			<div class="flex flex-col gap-4">
				{#each group.cases as c (c.id)}
					<a
						href={caseHref(c)}
						class="group block w-full rounded-box transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--type-accent)"
					>
						<CaseView case={c} {slim} />
					</a>
				{/each}
			</div>
		</section>
	{/each}
	{#if cases.length === 0}
		<div class="card card-dash border-base-300 p-10 text-center text-base-content/50">
			No cases found.
		</div>
	{/if}
</div>
