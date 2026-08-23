<script lang="ts">
	import { CircleAlert, ShieldCheck } from "@lucide/svelte";
	import { isAlgorithmCorrect } from "$lib/cube/isAlgorithmCorrect";
	import type { ViewType } from "$lib/data/types";

	interface Props {
		algorithm: string;
		setup: string;
		onlyError?: boolean;
		viewType: ViewType;
	}

	let { algorithm, setup, onlyError = false, viewType }: Props = $props();

	const isCorrect = $derived(isAlgorithmCorrect(setup, algorithm, viewType));
</script>

<!-- The verdict icon explains itself with a daisyUI tooltip on hover / focus. -->
{#if isCorrect}
	{#if !onlyError}
		<span
			role="img"
			aria-label="Algorithm is good"
			class="tooltip tooltip-success text-success"
			data-tip="Algorithm is good"
		>
			<ShieldCheck class="size-4" />
		</span>
	{/if}
{:else}
	<span
		role="img"
		aria-label="Algorithm is bad"
		class="tooltip tooltip-error text-error"
		data-tip="Algorithm is bad"
	>
		<CircleAlert class="size-4" />
	</span>
{/if}
