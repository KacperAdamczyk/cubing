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
	const maskedColors = [Colors.Y, Colors.B, Colors.O];
</script>

<!-- Isometric F2L: the U / F / R faces of a cube, positioned with real 3D
     transforms. Sizes use container-query units so the cube scales to its box. -->
<div class="scene">
	<div class="stage">
		<div class="cube">
			<div class="face face-top"><Face face={faces.U} {maskedColors} /></div>
			<div class="face face-front"><Face face={faces.F} {maskedColors} /></div>
			<div class="face face-right"><Face face={faces.R} {maskedColors} /></div>
		</div>
	</div>
</div>

<style>
	.scene {
		width: 100%;
		aspect-ratio: 1;
		container-type: inline-size;
	}

	.stage {
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
		perspective: 240cqw;
	}

	.cube {
		position: relative;
		width: 60cqw;
		height: 60cqw;
		transform: rotateX(-24deg) rotateY(-36deg);
		transform-style: preserve-3d;
	}

	.face {
		position: absolute;
		inset: 0;
	}

	.face-front {
		transform: translateZ(30cqw);
	}

	.face-top {
		transform: rotateX(90deg) translateZ(30cqw);
	}

	.face-right {
		transform: rotateY(90deg) translateZ(30cqw);
	}
</style>
