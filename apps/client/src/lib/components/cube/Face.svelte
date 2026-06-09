<script lang="ts">
	import type { AdjacentPieces, Color, FaceGrid, Face } from 'cube';
	import Piece, { blankColor } from './Piece.svelte';

	interface Props {
		class?: string;
		face: FaceGrid<Color>;
		maskedColors: (Color | undefined)[];
		maskedAdjPieces?: Partial<AdjacentPieces<true | undefined>>;
		adjacentPieces?: AdjacentPieces<Color>;
		faceLabel?: Face;
	}

	let {
		class: className = '',
		face,
		maskedColors,
		maskedAdjPieces,
		adjacentPieces,
		faceLabel
	}: Props = $props();

	const maskedColorsSet = $derived(new Set(maskedColors));

	const mask = (color: Color, hidden?: true): Color | typeof blankColor | undefined =>
		hidden ? undefined : maskedColorsSet.has(color) ? blankColor : color;

	const pieces = $derived(face.flat().map((piece) => mask(piece)));
</script>

<div
	class={[
		'grid aspect-square h-full w-full grid-cols-cube grid-rows-cube gap-[2%]',
		{ 'grid-cols-cube-flat': !adjacentPieces, 'grid-rows-cube-flat': !adjacentPieces },
		className
	]}
>
	{#if adjacentPieces}
		<Piece
			class="col-start-2 row-start-1"
			color={mask(adjacentPieces.Top[0], maskedAdjPieces?.Top?.[0])}
		/>
		<Piece
			class="col-start-3 row-start-1"
			color={mask(adjacentPieces.Top[1], maskedAdjPieces?.Top?.[1])}
		/>
		<Piece
			class="col-start-4 row-start-1"
			color={mask(adjacentPieces.Top[2], maskedAdjPieces?.Top?.[2])}
		/>
		<Piece
			class="col-start-1 row-start-2"
			color={mask(adjacentPieces.Left[0], maskedAdjPieces?.Left?.[0])}
		/>
	{/if}

	<Piece class="col-start-2 row-start-2" color={pieces[0]} />
	<Piece class="col-start-3 row-start-2" color={pieces[1]} />
	<Piece class="col-start-4 row-start-2" color={pieces[2]} />

	{#if adjacentPieces}
		<Piece
			class="col-start-5 row-start-2"
			color={mask(adjacentPieces.Right[0], maskedAdjPieces?.Right?.[0])}
		/>
		<Piece
			class="col-start-1 row-start-3"
			color={mask(adjacentPieces.Left[1], maskedAdjPieces?.Left?.[1])}
		/>
	{/if}

	<Piece class="col-start-2 row-start-3" color={pieces[3]} />
	<Piece class="col-start-3 row-start-3" color={pieces[4]} />
	{#if faceLabel}
		<div
			class="relative col-start-3 row-start-3 flex items-center justify-center text-2xl font-bold text-base-content/40 select-none"
		>
			{faceLabel}
		</div>
	{/if}
	<Piece class="col-start-4 row-start-3" color={pieces[5]} />

	{#if adjacentPieces}
		<Piece
			class="col-start-5 row-start-3"
			color={mask(adjacentPieces.Right[1], maskedAdjPieces?.Right?.[1])}
		/>
		<Piece
			class="col-start-1 row-start-4"
			color={mask(adjacentPieces.Left[2], maskedAdjPieces?.Left?.[2])}
		/>
	{/if}

	<Piece class="col-start-2 row-start-4" color={pieces[6]} />
	<Piece class="col-start-3 row-start-4" color={pieces[7]} />
	<Piece class="col-start-4 row-start-4" color={pieces[8]} />

	{#if adjacentPieces}
		<Piece
			class="col-start-5 row-start-4"
			color={mask(adjacentPieces.Right[2], maskedAdjPieces?.Right?.[2])}
		/>
		<Piece
			class="col-start-2 row-start-5"
			color={mask(adjacentPieces.Bottom[0], maskedAdjPieces?.Bottom?.[0])}
		/>
		<Piece
			class="col-start-3 row-start-5"
			color={mask(adjacentPieces.Bottom[1], maskedAdjPieces?.Bottom?.[1])}
		/>
		<Piece
			class="col-start-4 row-start-5"
			color={mask(adjacentPieces.Bottom[2], maskedAdjPieces?.Bottom?.[2])}
		/>
	{/if}
</div>
