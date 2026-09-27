import { cpSync, rmSync } from 'node:fs';

// The existing Cloudflare Pages project was created from the SvelteKit preset,
// which publishes `.svelte-kit/cloudflare`.
const destination = '.svelte-kit/cloudflare';
rmSync(destination, { recursive: true, force: true });
cpSync('dist', destination, { recursive: true });
