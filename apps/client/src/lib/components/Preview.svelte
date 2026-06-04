<script lang="ts">
	import type { ViewType } from '$lib/data/types';
	import CubeView from './cube/CubeView.svelte';

	interface Props {
		name: string;
		size: number;
		href: string;
		previewAlgorithm: string;
		viewType: ViewType;
		isActive?: boolean;
		all?: boolean;
	}

	let {
		name,
		size,
		href,
		previewAlgorithm,
		viewType,
		isActive = false,
		all = false
	}: Props = $props();
</script>

<a
	{href}
	data-type={all ? 'all' : viewType}
	class={[
		'relative flex w-36 flex-col items-center gap-2 overflow-hidden rounded-box border bg-base-100 p-4 transition-all duration-150',
		'hover:-translate-y-0.5 hover:shadow-md',
		isActive
			? 'border-(--type-accent) shadow-[0_0_0_1px_var(--type-accent)]'
			: 'border-base-300 shadow-sm'
	]}
>
	<span class={['absolute inset-x-0 top-0 h-1', all ? 'cube-gradient' : 'bg-(--type-accent)']}
	></span>
	<div class="size-20">
		<CubeView algorithm={previewAlgorithm} type={viewType} />
	</div>
	<h2 class="text-center font-bold tracking-tight">{name}</h2>
	<span
		class="mt-auto rounded-full bg-base-200 px-2.5 py-0.5 text-xs font-semibold text-base-content/70"
	>
		{size}
	</span>
</a>
