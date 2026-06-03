<script lang="ts">
	import { CircleAlert, ShieldCheck } from '@lucide/svelte';
	import { isAlgorithmCorrect } from '$lib/cube/isAlgorithmCorrect';
	import type { ViewType } from '$lib/data/types';

	interface Props {
		algorithm: string;
		setup: string;
		onlyError?: boolean;
		viewType: ViewType;
	}

	let { algorithm, setup, onlyError = false, viewType }: Props = $props();

	const isCorrect = $derived(isAlgorithmCorrect(setup, algorithm, viewType));
</script>

{#if isCorrect}
	{#if !onlyError}
		<span title="Algorithm is good" class="text-success"><ShieldCheck class="size-4" /></span>
	{/if}
{:else}
	<span title="Algorithm is bad" class="text-error"><CircleAlert class="size-4" /></span>
{/if}
