# Sentiment Analysis World Map

An interactive React 19 + Vite map that visualizes country-level sentiment with a colour-vision-safe blue-to-orange diverging net-sentiment scale. Countries with no survey row remain visible in gray and are labeled “No data”.

Live site: <https://riddhisc.github.io/world-map-sentiment-analysis/>

## Data

The repository currently ships a 27-country illustrative synthetic dataset at [`public/data/sentiment.json`](public/data/sentiment.json); it is not a real survey. Each row contains `country` (ISO-3), `positive`, `neutral`, `negative`, `sampleSize`, `updatedAt`, and `source`. No external ingestion pipeline is included; choose the real data source before adding one.

## Run locally

Requires Node.js 24 LTS. Use `npm ci`, then:

```bash
npm run dev
```

Open the URL printed by Vite. Local development uses `/` as the base path.

## Verify

```bash
npm run lint
npm test
npm run build
```

To preview the production build, run `npm run preview`. GitHub Pages builds with `VITE_BASE=/world-map-sentiment-analysis/` through the single workflow in `.github/workflows/deploy.yml`.

## Interactions

- Choose Overall, Positive, Neutral, or Negative sentiment.
- Filter by region.
- Drag or pinch/wheel to pan and zoom; Reset Map restores the initial view.
- Hover or tap a country for its data; click or press Enter/Space for the detail dialog.
