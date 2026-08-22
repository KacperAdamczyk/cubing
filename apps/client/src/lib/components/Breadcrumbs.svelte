<script lang="ts">
	import { ChevronLeft } from "@lucide/svelte";
	import favicon from "$lib/assets/favicon.svg";
	import type { Breadcrumb } from "$lib/data/types";

	interface Props {
		breadcrumbs: Breadcrumb[];
	}

	let { breadcrumbs }: Props = $props();

	const links = $derived(breadcrumbs.slice(0, -1));
	const parent = $derived(links.at(-1));
	const active = $derived(breadcrumbs.at(-1));
</script>

<!-- Phones get a single "back to parent" link (or the brand at the root);
     wider screens get the full trail. -->
{#if parent}
	<a
		href={parent.href}
		class="flex items-center gap-1 px-1 text-sm font-medium text-base-content/70 transition-colors hover:text-base-content sm:hidden"
	>
		<ChevronLeft class="size-4" />
		<span class="truncate">{parent.name}</span>
	</a>
{:else}
	<a href="/" class="flex items-center gap-2 px-1 sm:hidden">
		<img src={favicon} alt="" class="size-6" />
		<span class="font-display font-extrabold tracking-tight">My Cubing Algs</span>
	</a>
{/if}
<div class="breadcrumbs hidden px-2 text-sm sm:block">
	<ul>
		{#each links as link (link.href)}
			<li>
				<a href={link.href} class="text-base-content/55 transition-colors hover:text-base-content">
					{link.name}
				</a>
			</li>
		{/each}
		{#if active}
			<li class="font-semibold">{active.name}</li>
		{/if}
	</ul>
</div>
