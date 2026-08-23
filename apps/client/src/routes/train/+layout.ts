// The trainer is the one part of the app that depends on the query string
// (?cases=…&step=…), which prerendering cannot capture — so these routes opt
// out and are server-rendered on the Worker instead. They stay database-free
// at runtime: the prerender remote functions they call resolve to the JSON
// prerendered at build time (fetched from the static assets), never to
// `bun:sqlite`.
export const prerender = false;
