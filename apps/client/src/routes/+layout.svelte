<script lang="ts">
	import "./layout.css";
	import { Menu } from "@lucide/svelte";
	import type { Snippet } from "svelte";
	import { browser } from "$app/environment";
	import { onNavigate } from "$app/navigation";
	import { page } from "$app/state";
	import favicon from "$lib/assets/favicon.svg";
	import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
	import ThemeToggle from "$lib/components/ThemeToggle.svelte";
	import { getBreadcrumbs } from "$lib/data/breadcrumbs";
	import { getSidebar } from "$lib/data/catalog.remote";
	import AppSidebar from "$lib/layout/AppSidebar.svelte";

	let { children }: { children: Snippet } = $props();

	// The mobile drawer; closed again as soon as a link in it is followed.
	let drawerOpen = $state(false);
	onNavigate(() => {
		drawerOpen = false;
	});

	// Awaited outside any <svelte:boundary> so the data is awaited during SSR and
	// inlined into the prerendered HTML (a pending boundary would suppress that).
	const sidebar = await getSidebar();

	// The query string is off-limits while prerendering (SvelteKit throws on
	// `url.search`), and only the trainer's crumbs need it, so read it client-side.
	const breadcrumbs = $derived(
		getBreadcrumbs(sidebar, page.params, {
			pathname: page.url.pathname,
			search: browser ? page.url.search : "",
		}),
	);
</script>

<svelte:head>
	<title>My Cubing Algs</title>
	<link rel="icon" type="image/svg+xml" href={favicon} />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#15151f" />
	<meta name="theme-color" media="(prefers-color-scheme: light)" content="#f2f4f7" />
</svelte:head>

<div class="drawer lg:drawer-open">
	<input id="app-drawer" type="checkbox" class="drawer-toggle" bind:checked={drawerOpen} />
	<div class="drawer-content app-bg flex min-h-screen flex-col">
		<header
			class="navbar sticky top-0 z-20 border-b border-base-300/80 bg-base-100/80 backdrop-blur-md"
		>
			<label for="app-drawer" class="btn btn-square btn-ghost lg:hidden" aria-label="Open sidebar">
				<Menu class="size-5" />
			</label>
			<div class="flex-1">
				<Breadcrumbs {breadcrumbs} />
			</div>
			<ThemeToggle />
		</header>
		<main class="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
			<div class="mx-auto w-full max-w-5xl">
				{@render children()}
			</div>
		</main>
	</div>
	<div class="drawer-side z-30">
		<label for="app-drawer" class="drawer-overlay" aria-label="Close sidebar"></label>
		<AppSidebar {sidebar} />
	</div>
</div>
