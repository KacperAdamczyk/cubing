<script lang="ts">
	import { page } from '$app/state';
	import type { PreviewItem } from '$lib/data/types';
	import Preview from './Preview.svelte';

	interface Props {
		items: PreviewItem[];
	}

	let { items }: Props = $props();
</script>

<div class="flex flex-wrap gap-3">
	{#each items as item (item.href)}
		<Preview {...item} isActive={item.href === page.url.pathname} />
	{/each}
</div>
