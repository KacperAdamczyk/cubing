<script lang="ts">
	import './layout.css';
	import { Menu } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import AppSidebar from '$lib/layout/AppSidebar.svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<svelte:head>
	<title>My Cubing Algs</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="drawer lg:drawer-open">
	<input id="app-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex min-h-screen flex-col">
		<header class="navbar border-b border-base-300 bg-base-100">
			<label for="app-drawer" class="btn btn-square btn-ghost lg:hidden" aria-label="Open sidebar">
				<Menu class="size-5" />
			</label>
			<div class="flex-1">
				<Breadcrumbs breadcrumbs={page.data.breadcrumbs ?? []} />
			</div>
			<ThemeToggle />
		</header>
		<main class="flex-1 p-4">
			{@render children()}
		</main>
	</div>
	<div class="drawer-side z-10">
		<label for="app-drawer" class="drawer-overlay" aria-label="Close sidebar"></label>
		<AppSidebar sidebar={data.sidebar} />
	</div>
</div>
