export type ViewType = "F2L" | "OLL" | "PLL";

export interface Cube {
	id: string;
	name: string;
}

export interface Set {
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
	subset: Subset & { set: Set };
	algorithms: Algorithm[];
}

export interface SidebarSubset extends Subset {
	cases: Array<Pick<Case, "id" | "name">>;
}

export interface SidebarSet extends Set {
	subsets: SidebarSubset[];
}

export interface SidebarCube extends Cube {
	sets: SidebarSet[];
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
	sets: Array<Pick<Set, "id" | "name" | "viewType"> & { href: string; size: number }>;
}

/** The previous / next case inside the same subset, for case-page navigation. */
export interface CaseNeighbor extends Pick<Case, "id" | "name" | "setup"> {
	href: string;
}

export interface Breadcrumb {
	name: string;
	href: string;
}
