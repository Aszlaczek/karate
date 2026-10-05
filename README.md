# KIHON — Kyokushin Exam Guide

React + Vite + TypeScript + Tailwind v4. Single-page site (hero, belt/kyu exam
requirements, technique atlas with SVG motion diagrams, Dojo-kun) — a faithful
rebuild of the source in `old_src/`. The AI chat assistant has been removed.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build     # tsc -b && vite build -> dist/
npm run preview
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

`vite.config.ts` uses `base: "./"`, so it works for any repo name without
configuration.
