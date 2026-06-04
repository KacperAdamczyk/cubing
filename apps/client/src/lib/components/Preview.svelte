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
	}

	let { name, size, href, previewAlgorithm, viewType, isActive = false }: Props = $props();
</script>

<a {href} class={['rounded-box', { 'ring-2 ring-cube-green': isActive }]}>
	<div class="card bg-base-200">
		<div class="card-body items-center gap-2 p-4">
			<h2 class="card-title text-center">{name}</h2>
			<div class="size-20">
				<CubeView algorithm={previewAlgorithm} type={viewType} />
			</div>
			<span class="badge badge-neutral">{size}</span>
		</div>
	</div>
</a>
