<script lang="ts">
	import PreviewList from '$lib/components/PreviewList.svelte';
	import { getCubesView } from '$lib/data/catalog.remote';

	const items = await getCubesView();
</script>

<PreviewList {items} />
