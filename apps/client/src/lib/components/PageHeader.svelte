<script lang="ts">
	import type { ViewType } from "$lib/data/types";

	interface Props {
		title: string;
		/** Small uppercase line above the title, e.g. the parent cube / set. */
		eyebrow?: string;
		description?: string;
		/** Short facts rendered as pills on the right, e.g. "21 cases". */
		stats?: string[];
		/** Colours the title marker; "all" (default) renders no marker. */
		viewType?: ViewType | "all";
	}

	let { title, eyebrow, description, stats = [], viewType = "all" }: Props = $props();
</script>

<header data-type={viewType} class="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
	<div class="min-w-0">
		{#if eyebrow}
			<p class="mb-1 text-sm font-semibold text-base-content/55">{eyebrow}</p>
		{/if}
		<div class="flex items-center gap-3">
			{#if viewType !== 'all'}
				<span class="size-3.5 shrink-0 rounded-[4px] bg-(--type-accent)" aria-hidden="true"></span>
			{/if}
			<h1 class="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
		</div>
		{#if description}
			<p class="mt-2 max-w-prose text-sm text-base-content/65 sm:text-base">{description}</p>
		{/if}
	</div>
	{#if stats.length > 0}
		<ul class="flex flex-wrap items-center gap-2">
			{#each stats as stat (stat)}
				<li
					class="badge badge-sm border-base-300 bg-base-100 font-semibold text-base-content/70 shadow-xs"
				>
					{stat}
				</li>
			{/each}
		</ul>
	{/if}
</header>
