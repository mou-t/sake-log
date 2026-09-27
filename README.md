# お酒メモ

Read-only sake log. Astro server-renders two screens from the microCMS `sake` endpoint: an Instagram-style profile (home) and a post detail page.

## Run

```bash
cp .env.example .env
npm install
npm run dev
```

`npm run build` prerenders the site into `dist/` and copies it to `.svelte-kit/cloudflare` for the existing Cloudflare Pages project. `npm run preview` serves that build.

Cloudflare Pages runs this on Node.js 22.16.0 (see `.node-version`). Set `MICROCMS_DOMAIN` and `MICROCMS_APIKEY` as Pages environment variables so the build can read the `sake` endpoint. The previous app pinned Node 20.3.1, which cannot run Astro 7.

## Environment

| Variable | Required | Description |
| --- | --- | --- |
| `MICROCMS_DOMAIN` | yes, in production | Service id — the subdomain of `https://<id>.microcms.io`, not the full URL |
| `MICROCMS_APIKEY` | yes, in production | API key with read access to the `sake` endpoint |

The production build fetches microCMS while prerendering (`getAllContents` for the grid and each `/sake/[id]` page). The API key is not sent to the browser. Country chips and 探す filter that prerendered list in the page.

`npm run dev` without those variables renders local sample posts so the layout can be reviewed. A production build does not use that sample data.
