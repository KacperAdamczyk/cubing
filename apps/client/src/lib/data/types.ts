export type ViewType = "F2L" | "OLL" | "PLL";

export interface Cube {
	id: string;
	name: string;
}

export interface CubeSet {
	id: string;
	name: string;
	previewAlgorithm: string;
	cubeId: string;
	viewType: ViewType;
}

export interface Subset {
	id: string;
	name: string;
	previewAlgorithm: string;
	setId: string;
}

export interface Case {
	id: string;
	name: string;
	setup: string;
	subsetId: string;
	defaultAlgorithmId: string | null;
}

export interface Algorithm {
	id: string;
	name: string;
	caseId: string;
	rotations: string;
	mnemonics: string | null;
	description: string | null;
}

/** View-model = the relational-query result: a case with its joined subset (+ set) and algorithms. */
export interface CaseWithContext extends Case {
	subset: Subset & { set: CubeSet };
	algorithms: Algorithm[];
}

export interface SidebarSubset extends Subset {
	cases: Array<Pick<Case, "id" | "name">>;
}

export interface SidebarSet extends CubeSet {
	subsets: SidebarSubset[];
}

export interface SidebarCube extends Cube {
	sets: SidebarSet[];
}

/* The training tree: the full cube → set → subset → case hierarchy with every
 * case's algorithms, so the trainer can render any selection of cases. */

export interface TrainingCase extends Case {
	algorithms: Algorithm[];
}

export interface TrainingSubset extends Subset {
	cases: TrainingCase[];
}

export interface TrainingSet extends CubeSet {
	subsets: TrainingSubset[];
}

export interface TrainingCube extends Cube {
	sets: TrainingSet[];
}

/** One trainable case with its ancestors, flattened out of the training tree. */
export interface TrainingEntry {
	cube: TrainingCube;
	set: TrainingSet;
	subset: TrainingSubset;
	case: TrainingCase;
}

export interface PreviewItem {
	href: string;
	name: string;
	previewAlgorithm: string;
	size: number;
	viewType: ViewType;
	/** True for the "All" chip, which spans every type and uses the neutral cube-gradient accent. */
	all?: boolean;
}

/** Home-page summary of a cube: its size plus a per-set breakdown. */
export interface CubeSummary extends Cube {
	href: string;
	size: number;
	sets: Array<Pick<CubeSet, "id" | "name" | "viewType"> & { href: string; size: number }>;
}

/** The previous / next case inside the same subset, for case-page navigation. */
export interface CaseNeighbor extends Pick<Case, "id" | "name" | "setup"> {
	href: string;
}

export interface Breadcrumb {
	name: string;
	href: string;
}
