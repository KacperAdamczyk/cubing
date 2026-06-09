<script lang="ts">
	import { Color } from 'cube';
	import LastLayer from './LastLayer.svelte';

	interface Props {
		algorithm: string;
	}

	let { algorithm }: Props = $props();
</script>

<LastLayer maskedColors={[Color.B, Color.G, Color.O, Color.R, Color.W]} {algorithm} />
