<script lang="ts">
	import { page } from "$app/state";
	import type { PreviewItem } from "$lib/data/types";
	import Preview from "./Preview.svelte";

	interface Props {
		items: PreviewItem[];
	}

	let { items }: Props = $props();
</script>

<!-- A daisyUI carousel (edge-to-edge snap-scroller) on phones, a wrapping row from `sm` up. -->
<div class="-mx-4 -my-1 sm:mx-0">
	<div class="carousel w-full gap-3 px-4 py-1 sm:flex-wrap sm:overflow-visible sm:px-0">
		{#each items as item (item.href)}
			<Preview {...item} isActive={item.href === page.url.pathname} />
		{/each}
	</div>
</div>
