<script lang="ts">
	import { Colors } from 'cube';
	import LastLayer from './LastLayer.svelte';

	interface Props {
		algorithm: string;
	}

	let { algorithm }: Props = $props();
</script>

<LastLayer maskedColors={[Colors.B, Colors.G, Colors.O, Colors.R, Colors.W]} {algorithm} />
