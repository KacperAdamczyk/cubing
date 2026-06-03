<script lang="ts">
	import { algorithmToFaces, Colors } from 'cube';
	import Face from './Face.svelte';

	interface Props {
		algorithm: string;
	}

	let { algorithm }: Props = $props();

	const faces = $derived(
		algorithmToFaces({ algorithm, orientation: { U: Colors.Y, F: Colors.R } })
	);
</script>

<div class="grid aspect-square origin-bottom-left scale-125 grid-cols-2 grid-rows-2">
	<Face
		class="row-start-1 h-1/2 origin-bottom-left translate-y-full -skew-x-45"
		face={faces.U}
		maskedColors={[Colors.Y, Colors.B, Colors.O]}
	/>
	<Face class="row-start-2" face={faces.F} maskedColors={[Colors.Y, Colors.B, Colors.O]} />
	<Face
		class="row-start-2 w-1/2 origin-bottom-left -skew-y-45"
		face={faces.R}
		maskedColors={[Colors.Y, Colors.B, Colors.O]}
	/>
</div>
