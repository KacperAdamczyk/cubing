<script lang="ts">
	import type { TrainingCube, TrainingSet, TrainingSubset } from "$lib/data/types";
	import CubeView from "../cube/CubeView.svelte";

	interface Props {
		tree: TrainingCube[];
		selected: ReadonlySet<string>;
		/** Called with every case id of the toggled node and the new checked state. */
		ontoggle: (ids: string[], checked: boolean) => void;
	}

	let { tree, selected, ontoggle }: Props = $props();

	const subsetIds = (subset: TrainingSubset) => subset.cases.map((c) => c.id);
	const setIds = (set: TrainingSet) => set.subsets.flatMap(subsetIds);
	const cubeIds = (cube: TrainingCube) => cube.sets.flatMap(setIds);

	const countSelected = (ids: string[]) => ids.filter((id) => selected.has(id)).length;
</script>

<!-- A group's checkbox: ticked when every case below it is selected, a dash
     when only some are. It sits directly in the row (no wrapping label) so a
     click on it toggles the selection without also folding the <details>. -->
{#snippet groupCheckbox(ids: string[], name: string)}
	{@const n = countSelected(ids)}
	<input
		type="checkbox"
		class="checkbox checkbox-sm rounded-md"
		checked={n > 0 && n === ids.length}
		indeterminate={n > 0 && n < ids.length}
		aria-label={`Select all ${name}`}
		onchange={(e) => ontoggle(ids, e.currentTarget.checked)}
	/>
{/snippet}

{#snippet count(ids: string[])}
	<span class="justify-self-end text-[11px] font-semibold text-base-content/45 tabular-nums">
		{countSelected(ids)}/{ids.length}
	</span>
{/snippet}

<!-- daisyUI menu as a tree: nested lists draw the guide lines, <details>
     gives each set / subset a native fold with the menu's chevron. -->
<ul class="menu w-full gap-0.5 px-0">
	{#each tree as cube (cube.id)}
		{@const ids = cubeIds(cube)}
		<li>
			<details open>
				<summary class="font-display text-[15px] font-bold">
					{@render groupCheckbox(ids, cube.name)}
					<span>{cube.name}</span>
					{@render count(ids)}
				</summary>
				<ul>
					{#each cube.sets as set (set.id)}
						{@const sIds = setIds(set)}
						<li data-type={set.viewType}>
							<details open>
								<summary class="font-display text-[15px] font-bold">
									{@render groupCheckbox(sIds, set.name)}
									<span class="flex items-center gap-2.5">
										<span class="size-2.5 rounded-[3px] bg-(--type-accent)"></span>
										{set.name}
									</span>
									{@render count(sIds)}
								</summary>
								<ul>
									{#each set.subsets as subset (subset.id)}
										{@const ssIds = subsetIds(subset)}
										<li>
											<details open>
												<summary class="font-medium">
													{@render groupCheckbox(ssIds, subset.name)}
													<span>{subset.name}</span>
													{@render count(ssIds)}
												</summary>
												<ul>
													{#each subset.cases as c (c.id)}
														<li>
															<label>
																<input
																	type="checkbox"
																	class="checkbox checkbox-sm rounded-md"
																	checked={selected.has(c.id)}
																	onchange={(e) => ontoggle([c.id], e.currentTarget.checked)}
																/>
																<span class="flex items-center gap-2.5">
																	<span class="size-8 shrink-0" aria-hidden="true">
																		<CubeView algorithm={c.setup} type={set.viewType} />
																	</span>
																	{c.name}
																</span>
															</label>
														</li>
													{/each}
												</ul>
											</details>
										</li>
									{/each}
								</ul>
							</details>
						</li>
					{/each}
				</ul>
			</details>
		</li>
	{/each}
</ul>
