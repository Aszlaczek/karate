# KIHON — Kyokushin Exam Guide

React + Vite + TypeScript + Tailwind v4 + react-router. Multi-page SPA guide:
one endpoint per exam level (`/kyu/9` … `/kyu/1`, `/kyu/start`, `/kyu/dan`),
technique atlas with SVG motion diagrams, karate glossary (`/slownik`) and
Dojo-kun — a faithful rebuild of the source in `old_src/`. The AI chat
assistant has been removed.

All content lives in `src/data/*.json` (levels, techniques, glossary,
dojo-kun) — a single source of truth consumed by the UI.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build     # tsc -b && vite build -> dist/
npm run preview   # SPA fallback works for deep routes
```

## Deploy to GitHub Pages (Actions)

The workflow `.github/workflows/deploy.yml` builds and publishes `dist/` on every
push to `main` (or `master`).

1. Create the repo and push:

   ```bash
   git init
   git add .
   git commit -m "Kihon — Kyokushin exam guide"
   git branch -M main
   git remote add origin https://github.com/<USER>/<REPO>.git
   git push -u origin main
   ```

2. On GitHub: **Settings → Pages → Source → GitHub Actions**.

3. Push again (or run the *Deploy to GitHub Pages* workflow manually from
   **Actions**). The site is served at `https://<USER>.github.io/<REPO>/`.

The workflow builds with `VITE_BASE=/<REPO>/` (absolute asset paths) and
copies `index.html` to `404.html` so deep routes like `/REPO/kyu/9` reload
correctly on GitHub Pages. Locally the base defaults to `/`.
