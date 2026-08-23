<script lang="ts">
	import { Moon, Sun } from "@lucide/svelte";

	let theme = $state<"light" | "dark">("dark");

	$effect(() => {
		const current = document.documentElement.dataset.theme;
		if (current === "light" || current === "dark") {
			theme = current;
		}
	});

	const toggle = () => {
		theme = theme === "dark" ? "light" : "dark";
		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem("theme", theme);
		} catch {
			// ignore storage errors (e.g. private mode)
		}
	};
</script>

<!-- A daisyUI swap: the (visually hidden) checkbox is "on" in light mode and
     rotates the sun/moon icons into each other. -->
<label
	class="btn btn-circle btn-ghost swap swap-rotate has-focus-visible:outline-2 has-focus-visible:outline-offset-2"
>
	<input type="checkbox" aria-label="Toggle theme" checked={theme === 'light'} onchange={toggle} />
	<Sun class="swap-off size-5" />
	<Moon class="swap-on size-5" />
</label>
