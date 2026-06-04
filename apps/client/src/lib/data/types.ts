export type ViewType = 'F2L' | 'OLL' | 'PLL';

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

/** View-model assembled by the repository for the UI. */
export interface CaseWithContext {
	id: string;
	name: string;
	setup: string;
	viewType: ViewType;
	set: Set;
	subset: Subset;
	/** Default algorithm first, then the rest in source order. */
	algorithms: Algorithm[];
}

export interface SidebarSubset extends Subset {
	cases: Array<Pick<Case, 'id' | 'name'>>;
}

export interface SidebarSet extends Set {
	subsets: SidebarSubset[];
}

export interface PreviewItem {
	href: string;
	name: string;
	previewAlgorithm: string;
	size: number;
	viewType: ViewType;
	/** True for the home "All" chip, which spans every type and uses the neutral cube-gradient accent. */
	all?: boolean;
}

export interface Breadcrumb {
	name: string;
	href: string;
}
