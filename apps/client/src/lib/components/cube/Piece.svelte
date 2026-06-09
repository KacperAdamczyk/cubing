<script lang="ts" module>
	export const blankColor = 'X';
</script>

<script lang="ts">
	import { Color } from 'cube';

	interface Props {
		color?: Color | typeof blankColor;
		class?: string;
	}

	let { color, class: className = '' }: Props = $props();
</script>

<div
	class={[
		className,
		'rounded',
		{
			'bg-cube-blank': color === blankColor,
			'bg-cube-green': color === Color.G,
			'bg-cube-red': color === Color.R,
			'bg-cube-blue': color === Color.B,
			'bg-cube-orange': color === Color.O,
			'bg-cube-yellow': color === Color.Y,
			'bg-cube-white': color === Color.W
		}
	]}
></div>
