# お酒メモ

Read-only sake log. Astro server-renders two screens from the microCMS `sake` endpoint: an Instagram-style profile (home) and a post detail page.

## Run

```bash
cp .env.example .env
npm install
npm run dev
```

`npm run build` then `npm run preview` serves the production Node server.

## Environment

| Variable | Required | Description |
| --- | --- | --- |
| `MICROCMS_DOMAIN` | yes, in production | Service id — the subdomain of `https://<id>.microcms.io`, not the full URL |
| `MICROCMS_APIKEY` | yes, in production | API key with read access to the `sake` endpoint |

Content is fetched on the server (`getAllContents` for the grid, `getListDetail` for `/sake/[id]`). The API key is not sent to the browser.

`npm run dev` without those variables renders local sample posts so the layout can be reviewed. A production server does not use that sample data.
