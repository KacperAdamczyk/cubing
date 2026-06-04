import * as repo from '$lib/server/repository';

export const prerender = true;

export const entries = () => repo.getSets().map((set) => ({ setId: set.id }));
