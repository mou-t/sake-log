# お酒メモ

Read-only sake log. Astro prerenders two screens from the microCMS `sake` endpoint: an Instagram-style profile (home) and a post detail page.

## Run

```bash
cp .env.example .env
npm install
npm run dev
```

`npm run build` writes a static site to `dist/`. `npm run preview` serves that build. `npm run deploy` publishes `dist/` with `wrangler deploy`.

## Deploy

Host this as [Cloudflare Workers static assets](https://developers.cloudflare.com/workers/static-assets/), not the old Cloudflare Pages project. There is no Worker script and no on-demand rendering. `wrangler.jsonc` points at `./dist` and runs `npm run build` before `wrangler deploy` or `wrangler versions upload`, so the asset directory exists even when the dashboard build command is empty.

[Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) uses Node.js 24.18.0 by default. Astro 7 requires Node.js `>=22.12.0`, so that default is enough and this repo does not pin `.node-version`.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

Set `MICROCMS_DOMAIN` and `MICROCMS_APIKEY` as build environment variables. The build fetches the `sake` endpoint while prerendering. The API key is not sent to the browser. Country chips and 探す filter that prerendered list in the page.

Disconnect the old Pages Git integration. That project still expects `.svelte-kit/cloudflare` and an older Node image, so it will keep failing on this branch.

## Environment

| Variable | Required | Description |
| --- | --- | --- |
| `MICROCMS_DOMAIN` | yes, for a production build | Service id — the subdomain of `https://<id>.microcms.io`, not the full URL |
| `MICROCMS_APIKEY` | yes, for a production build | API key with read access to the `sake` endpoint |

`npm run dev` without those variables renders local sample posts so the layout can be reviewed. A production build does not use that sample data.
