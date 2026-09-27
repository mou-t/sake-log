import node from '@astrojs/node';
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
	output: 'server',
	adapter: node({ mode: 'standalone' }),
	prefetch: true,
	env: {
		schema: {
			MICROCMS_DOMAIN: envField.string({
				context: 'server',
				access: 'secret',
				optional: true,
			}),
			MICROCMS_APIKEY: envField.string({
				context: 'server',
				access: 'secret',
				optional: true,
			}),
		},
	},
});
