<script lang="ts">
	interface Props {
		notation: string;
		class?: string;
	}

	let { notation, class: className = "" }: Props = $props();

	type Part = { text: string; kind: "move" | "rotation" | "bracket" | "space" };
	// A flat list of groups and the gaps between them. Each `{#each}` iteration
	// below renders exactly one node, so Svelte's block-boundary whitespace
	// trimming keeps the rendered text identical to the source notation.
	type Item = { kind: "gap" } | { kind: "group"; parts: Part[] };

	const SPACE: Part = { text: " ", kind: "space" };
	const GAP: Item = { kind: "gap" };

	/** [a, b, c] → [a, sep, b, sep, c] */
	const interleave = <T>(list: T[], separator: T): T[] =>
		list.flatMap((item, i) => (i > 0 ? [separator, item] : [item]));

	// Whole-cube rotations (x, y, z — optionally primed / doubled) are not turns,
	// so they render softer than the moves themselves.
	const isRotation = (token: string) => /^[xyz](2'?|'2?)?$/.test(token);

	// Split one chunk — "(R U R')", "[U2]", "y'" — into brackets, moves and spaces.
	const toParts = (chunk: string): Part[] => {
		const [, open = "", body = "", close = ""] = /^([([]*)(.*?)([)\]]*)$/.exec(chunk) ?? [];
		const moves = body
			.trim()
			.split(/\s+/)
			.filter(Boolean)
			.map((token): Part => ({ text: token, kind: isRotation(token) ? "rotation" : "move" }));
		return [
			...(open ? [{ text: open, kind: "bracket" } satisfies Part] : []),
			...interleave(moves, SPACE),
			...(close ? [{ text: close, kind: "bracket" } satisfies Part] : []),
		];
	};

	// Parenthesised / bracketed trigger groups stay on one line; the rest wraps.
	const items = $derived(
		interleave(
			(notation.trim().match(/\([^)]*\)|\[[^\]]*\]|\S+/g) ?? []).map(
				(chunk): Item => ({ kind: "group", parts: toParts(chunk) }),
			),
			GAP,
		),
	);
</script>

<span class={['font-mono', className]}>
	{#each items as item, i (i)}
		{#if item.kind === 'gap'}
			{' '}
		{:else}
			<span class="whitespace-nowrap">
				{#each item.parts as part, j (j)}
					{#if part.kind === 'space'}
						{' '}
					{:else}
						<span
							class={{
								'opacity-40': part.kind === 'bracket',
								'opacity-70 italic': part.kind === 'rotation'
							}}
						>
							{part.text}
						</span>
					{/if}
				{/each}
			</span>
		{/if}
	{/each}
</span>
