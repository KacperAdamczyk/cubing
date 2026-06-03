<script lang="ts">
	import type { ViewType } from '$lib/data/types';
	import F2L from './F2L.svelte';
	import OLL from './OLL.svelte';
	import PLL from './PLL.svelte';

	interface Props {
		algorithm: string;
		type: ViewType;
	}

	let { algorithm, type }: Props = $props();
</script>

{#if type === 'F2L'}
	<F2L {algorithm} />
{:else if type === 'OLL'}
	<OLL {algorithm} />
{:else if type === 'PLL'}
	<PLL {algorithm} />
{/if}
