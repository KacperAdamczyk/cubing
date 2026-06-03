import { getSidebarTree } from '$lib/data/repository';
import type { LayoutLoad } from './$types';

export const prerender = true;

export const load: LayoutLoad = () => ({ sidebar: getSidebarTree() });
