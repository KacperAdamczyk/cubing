import * as repo from "#lib/server/repository.js";

export const prerender = true;

export const entries = () => repo.getCubes().map((cube) => ({ cubeId: cube.id }));
