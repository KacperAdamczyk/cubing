<script lang="ts">
	import type { Breadcrumb } from '$lib/data/types';

	interface Props {
		breadcrumbs: Breadcrumb[];
	}

	let { breadcrumbs }: Props = $props();

	const links = $derived(breadcrumbs.slice(0, -1));
	const active = $derived(breadcrumbs.at(-1));
</script>

<div class="breadcrumbs text-sm">
	<ul>
		{#each links as link (link.href)}
			<li><a href={link.href}>{link.name}</a></li>
		{/each}
		{#if active}
			<li>{active.name}</li>
		{/if}
	</ul>
</div>
