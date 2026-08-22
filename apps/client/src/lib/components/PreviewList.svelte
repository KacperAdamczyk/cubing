<script lang="ts">
	import { page } from "$app/state";
	import type { PreviewItem } from "$lib/data/types";
	import Preview from "./Preview.svelte";

	interface Props {
		items: PreviewItem[];
	}

	let { items }: Props = $props();
</script>

<!-- A horizontal snap-scroller on phones, a wrapping row from `sm` up. -->
<div
	class="no-scrollbar -mx-4 -my-1 flex snap-x gap-3 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
>
	{#each items as item (item.href)}
		<Preview {...item} isActive={item.href === page.url.pathname} />
	{/each}
</div>
