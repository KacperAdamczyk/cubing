<script lang="ts">
	import LastLayer from './LastLayer.svelte';

	interface Props {
		algorithm: string;
	}

	let { algorithm }: Props = $props();
</script>

<LastLayer {algorithm} />
