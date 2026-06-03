<script lang="ts">
	import { algorithmToFaces, type ColorOrientation, Colors, Faces, getAdjacentPieces } from 'cube';
	import Face from './Face.svelte';

	interface Props {
		algorithm: string;
		maskedColors?: Colors[];
		orientation?: ColorOrientation;
	}

	let {
		algorithm,
		maskedColors = [],
		orientation = { U: Colors.Y, F: Colors.G }
	}: Props = $props();

	const faces = $derived(algorithmToFaces({ algorithm, orientation }));
	const adjacentColors = $derived(getAdjacentPieces(faces, Faces.U));
</script>

<Face face={faces.U} {maskedColors} adjacentPieces={adjacentColors} />
