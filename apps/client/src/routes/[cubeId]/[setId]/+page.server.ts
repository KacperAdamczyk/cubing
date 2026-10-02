import * as repo from "#lib/server/repository.js";

export const prerender = true;

export const entries = () => repo.getSets().map((set) => ({ cubeId: set.cubeId, setId: set.id }));
