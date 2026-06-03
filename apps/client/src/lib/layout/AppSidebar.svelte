<script lang="ts">
	import { GalleryVerticalEnd, Search } from '@lucide/svelte';
	import { page } from '$app/state';
	import type { SidebarSet } from '$lib/data/types';

	interface Props {
		sidebar: SidebarSet[];
	}

	let { sidebar }: Props = $props();

	let query = $state('');

	const filtered = $derived.by(() => {
		const q = query.toLowerCase();
		return sidebar
			.map((set) => ({
				...set,
				subsets: set.subsets
					.map((subset) =>
						subset.name.toLowerCase().includes(q)
							? subset
							: { ...subset, cases: subset.cases.filter((c) => c.name.toLowerCase().includes(q)) }
					)
					.filter((subset) => subset.cases.length > 0)
			}))
			.filter((set) => set.subsets.length > 0);
	});

	const isActive = (href: string) => page.url.pathname === href;
</script>

<aside class="flex min-h-full w-72 flex-col gap-2 bg-base-200 p-4">
	<a href="/" class="flex items-center gap-2 px-2 py-1">
		<span
			class="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-content"
		>
			<GalleryVerticalEnd class="size-4" />
		</span>
		<span class="font-semibold">Algorithms</span>
	</a>

	<label class="input input-sm w-full">
		<Search class="size-4 opacity-50" />
		<input
			type="search"
			aria-label="Search for algs"
			placeholder="Search for algs"
			bind:value={query}
		/>
	</label>

	<ul class="menu w-full grow flex-nowrap overflow-y-auto">
		{#each filtered as set (set.id)}
			<li>
				<a href={`/${set.id}`} class="font-semibold">{set.name}</a>
				<ul>
					{#each set.subsets as subset (subset.id)}
						<li>
							<a
								href={`/${set.id}/${subset.id}`}
								class:menu-active={isActive(`/${set.id}/${subset.id}`)}
							>
								{subset.name}
							</a>
							<ul>
								{#each subset.cases as c (c.id)}
									<li>
										<a
											href={`/${set.id}/${subset.id}/${c.id}`}
											class:menu-active={isActive(`/${set.id}/${subset.id}/${c.id}`)}
										>
											{c.name}
										</a>
									</li>
								{/each}
							</ul>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
</aside>
