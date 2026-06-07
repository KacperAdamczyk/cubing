<script lang="ts">
	import { Search } from '@lucide/svelte';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
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

	const activeBar = 'shadow-[inset_3px_0_0_0_var(--type-accent)]';
</script>

<aside class="flex min-h-full w-72 flex-col gap-3 border-r border-base-300 bg-base-100 p-4">
	<a href="/" class="flex items-center gap-2.5 px-2 py-1">
		<img src={favicon} alt="" class="size-8 drop-shadow-sm" />
		<span class="text-base font-bold tracking-tight">Algorithms</span>
	</a>

	<label class="input input-sm w-full rounded-field">
		<Search class="size-4 opacity-50" />
		<input
			type="search"
			aria-label="Search for algs"
			placeholder="Search for algs"
			bind:value={query}
		/>
	</label>

	<ul class="menu w-full grow flex-nowrap gap-0.5 overflow-y-auto px-0">
		{#each filtered as set (set.id)}
			<li data-type={set.viewType}>
				<a
					href={`/${set.id}`}
					class={[
						'gap-2.5 font-semibold transition-colors',
						isActive(`/${set.id}`) && `bg-(--type-soft) ${activeBar}`
					]}
				>
					<span class="size-2.5 rounded-[3px] bg-(--type-accent)"></span>
					{set.name}
				</a>
				<ul class="border-base-300">
					{#each set.subsets as subset (subset.id)}
						<li>
							<a
								href={`/${set.id}/${subset.id}`}
								class={[
									'transition-colors',
									isActive(`/${set.id}/${subset.id}`) && `bg-(--type-soft) font-medium ${activeBar}`
								]}
							>
								{subset.name}
							</a>
							<ul>
								{#each subset.cases as c (c.id)}
									<li>
										<a
											href={`/${set.id}/${subset.id}/${c.id}`}
											class={[
												'transition-colors',
												isActive(`/${set.id}/${subset.id}/${c.id}`) &&
													`bg-(--type-soft) font-medium ${activeBar}`
											]}
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
