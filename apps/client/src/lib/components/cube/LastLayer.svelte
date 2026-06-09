<script lang="ts">
	import {
		algorithmToFaces,
		type ColorOrientation,
		Color,
		Face as CubeFace,
		getAdjacentPieces
	} from 'cube';
	import Face from './Face.svelte';

	interface Props {
		algorithm: string;
		maskedColors?: Color[];
		orientation?: ColorOrientation;
	}

	let { algorithm, maskedColors = [], orientation = { U: Color.Y, F: Color.G } }: Props = $props();

	const faces = $derived(algorithmToFaces({ algorithm, orientation }));
	const adjacentColors = $derived(getAdjacentPieces(faces, CubeFace.U));
</script>

<Face face={faces.U} {maskedColors} adjacentPieces={adjacentColors} />
