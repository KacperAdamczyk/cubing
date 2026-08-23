import { db } from "db";
import type {
	CaseWithContext,
	Cube,
	CubeSet,
	SidebarCube,
	Subset,
	TrainingCube,
} from "$lib/data/types";

const caseWith = { subset: { with: { set: true } }, algorithms: true } as const;

export const getCubes = (): Cube[] => db.query.cube.findMany().sync();

export const findCube = (cubeId: string): Cube | undefined =>
	db.query.cube.findFirst({ where: { id: cubeId } }).sync();

export const getCubeSets = (cubeId: string): CubeSet[] =>
	db.query.set.findMany({ where: { cubeId } }).sync();

export const getSets = (): CubeSet[] => db.query.set.findMany().sync();

export const findSet = (setId: string): CubeSet | undefined =>
	db.query.set.findFirst({ where: { id: setId } }).sync();

export const findSubset = (subsetId: string): Subset | undefined =>
	db.query.subset.findFirst({ where: { id: subsetId } }).sync();

export const getSetSubsets = (setId: string): Subset[] =>
	db.query.subset.findMany({ where: { setId } }).sync();

export const getCubeCases = (cubeId: string): CaseWithContext[] =>
	db.query.case_.findMany({ where: { subset: { set: { cubeId } } }, with: caseWith }).sync();

export const getSetCases = (setId: string): CaseWithContext[] =>
	db.query.case_.findMany({ where: { subset: { setId } }, with: caseWith }).sync();

export const getSubsetCases = (subsetId: string): CaseWithContext[] =>
	db.query.case_.findMany({ where: { subsetId }, with: caseWith }).sync();

export const getAllCases = (): CaseWithContext[] =>
	db.query.case_.findMany({ with: caseWith }).sync();

export const getCase = (caseId: string): CaseWithContext | undefined =>
	db.query.case_.findFirst({ where: { id: caseId }, with: caseWith }).sync();

export const getSidebarTree = (): SidebarCube[] =>
	db.query.cube
		.findMany({
			with: {
				sets: { with: { subsets: { with: { cases: { columns: { id: true, name: true } } } } } },
			},
		})
		.sync();

/** The whole catalogue as one cube-rooted tree, cases included with their algorithms. */
export const getTrainingTree = (): TrainingCube[] =>
	db.query.cube
		.findMany({
			with: { sets: { with: { subsets: { with: { cases: { with: { algorithms: true } } } } } } },
		})
		.sync();
