<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';

	let theme = $state<'light' | 'dark'>('dark');

	$effect(() => {
		const current = document.documentElement.dataset.theme;
		if (current === 'light' || current === 'dark') {
			theme = current;
		}
	});

	const toggle = () => {
		theme = theme === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem('theme', theme);
		} catch {
			// ignore storage errors (e.g. private mode)
		}
	};
</script>

<button class="btn btn-circle btn-ghost" onclick={toggle} aria-label="Toggle theme">
	{#if theme === 'dark'}
		<Sun class="size-5" />
	{:else}
		<Moon class="size-5" />
	{/if}
</button>
