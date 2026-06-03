/**
 * One-off transform: legacy JSON (apps/client-legacy/src/data) -> normalized
 * tables mirroring packages/db/schema.ts (apps/client/src/lib/data/tables).
 * Run with: bun scripts/transform-legacy-data.ts
 * Kept for provenance and as the basis for a future db seed.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import setsJson from '../../client-legacy/src/data/sets.json';
import subsetsJson from '../../client-legacy/src/data/subsets.json';
import casesJson from '../../client-legacy/src/data/cases.json';

const outDir = resolve(import.meta.dir, '../src/lib/data/tables');
mkdirSync(outDir, { recursive: true });

const cube = [{ id: '3x3', name: '3x3' }];

const set = setsJson.map((s) => ({
	id: s.id,
	name: s.name,
	previewAlgorithm: '',
	cubeId: '3x3',
	viewType: s.viewType
}));

const subset = subsetsJson.map((s) => ({
	id: s.id,
	name: s.name,
	previewAlgorithm: s.previewAlgorithm,
	setId: s.setId
}));

const caseRows: unknown[] = [];
const algorithm: unknown[] = [];

for (const c of casesJson) {
	let defaultAlgorithmId: string | null = null;
	c.algorithms.forEach((a, i) => {
		const id = `${c.id}__${i}`;
		if (i === 0) defaultAlgorithmId = id;
		algorithm.push({
			id,
			name: `${c.name} ${i + 1}`,
			caseId: c.id,
			rotations: a.rotations,
			mnemonics: a.rotationsMnemonic,
			description: a.description
		});
	});
	caseRows.push({
		id: c.id,
		name: c.name,
		setup: c.setup,
		subsetId: c.subsetId,
		defaultAlgorithmId
	});
}

const write = (name: string, rows: unknown[]) =>
	writeFileSync(resolve(outDir, `${name}.json`), JSON.stringify(rows, null, '\t') + '\n');

write('cube', cube);
write('set', set);
write('subset', subset);
write('case', caseRows);
write('algorithm', algorithm);

console.log(
	`Wrote ${cube.length} cube, ${set.length} set, ${subset.length} subset, ${caseRows.length} case, ${algorithm.length} algorithm rows to ${outDir}`
);
