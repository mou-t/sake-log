import { defineConfig, envField } from 'astro/config';

export default defineConfig({
	output: 'static',
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
