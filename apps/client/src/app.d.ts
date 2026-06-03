// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			breadcrumbs?: import('$lib/data/types').Breadcrumb[];
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
