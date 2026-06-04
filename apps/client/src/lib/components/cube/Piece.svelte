<script lang="ts" module>
	export const blankColor = 'X';
</script>

<script lang="ts">
	import { Colors } from 'cube';

	interface Props {
		color?: Colors | typeof blankColor;
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
			'bg-cube-green': color === Colors.G,
			'bg-cube-red': color === Colors.R,
			'bg-cube-blue': color === Colors.B,
			'bg-cube-orange': color === Colors.O,
			'bg-cube-yellow': color === Colors.Y,
			'bg-cube-white': color === Colors.W
		}
	]}
></div>
