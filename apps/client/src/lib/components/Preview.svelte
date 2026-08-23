<script lang="ts">
	import type { ViewType } from "$lib/data/types";
	import CubeView from "./cube/CubeView.svelte";

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
		all = false,
	}: Props = $props();
</script>

<!-- A daisyUI card that is also a carousel item of the PreviewList scroller. -->
<a
	{href}
	data-type={all ? 'all' : viewType}
	aria-current={isActive ? 'page' : undefined}
	class={[
		'card card-border carousel-item box-border w-32 flex-col items-center gap-2 overflow-hidden p-3 transition-all duration-150 sm:w-34',
		'hover:-translate-y-0.5 hover:shadow-md',
		isActive
			? 'border-(--type-accent) bg-(--type-tint) shadow-[0_0_0_1px_var(--type-accent)]'
			: 'border-base-300 bg-base-100 shadow-sm'
	]}
>
	<span
		class={['absolute inset-x-0 top-0 h-1', all ? 'cube-gradient' : 'bg-(--type-accent)']}
	></span>
	<div class="size-16 sm:size-18">
		<CubeView algorithm={previewAlgorithm} type={viewType} />
	</div>
	<span
		class="font-display text-center text-[15px] leading-tight font-bold tracking-tight sm:text-base"
	>
		{name}
	</span>
	<span class="badge badge-ghost badge-sm mt-auto font-semibold text-base-content/70">{size}</span>
</a>
