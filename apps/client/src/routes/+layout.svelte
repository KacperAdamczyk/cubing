<script lang="ts">
	import './layout.css';
	import { Menu } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import AppSidebar from '$lib/layout/AppSidebar.svelte';
	import { getBreadcrumbs } from '$lib/data/breadcrumbs';
	import { getSidebar } from '$lib/data/catalog.remote';

	let { children }: { children: Snippet } = $props();

	const sidebar = await getSidebar();
</script>

<svelte:head>
	<title>My Cubing Algs</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<svelte:boundary>
	<div class="drawer lg:drawer-open">
		<input id="app-drawer" type="checkbox" class="drawer-toggle" />
		<div class="drawer-content flex min-h-screen flex-col bg-base-200">
			<header class="navbar sticky top-0 z-20 border-b border-base-300 bg-base-100/85 backdrop-blur">
				<label for="app-drawer" class="btn btn-square btn-ghost lg:hidden" aria-label="Open sidebar">
					<Menu class="size-5" />
				</label>
				<div class="flex-1">
					<Breadcrumbs breadcrumbs={getBreadcrumbs(sidebar, page.params)} />
				</div>
				<ThemeToggle />
			</header>
			<main class="flex-1 p-4 sm:p-6">
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

	{#snippet pending()}
		<div class="flex min-h-screen items-center justify-center bg-base-200">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	{/snippet}
</svelte:boundary>
