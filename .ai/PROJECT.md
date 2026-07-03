# Project Memory

## Positioning

This project is Tim's personal running homepage: a public, visual archive of running and activity history, generated from local activity data and displayed as maps, stats, tables, and SVG summaries.

## Users

- Primary user: Tim, who maintains and reviews his activity history.
- Secondary users: visitors who view the public running page.
- Maintainers: AI coding agents and Tim.

## Current Version

- Upstream project: `running_page`, Python package version `2.5.1`.
- Frontend package: `yihong.run`, version `1.0.0`.
- Current branch: `master`.

## Current Sprint

Project onboarding and stabilization.

Sprint rule: do not expand scope by default. Preserve the existing running page, keep personal data safe, and make only small, clearly valuable improvements until Tim defines a new sprint.

## Goals

- P0: Keep the public running page buildable and usable.
- P0: Protect personal GPS/activity data and credentials.
- P0: Avoid accidental deletion of generated activity data.
- P1: Make future AI collaboration predictable through project memory files.
- P1: Add the smallest meaningful validation before code changes.

## Not Now

- Large redesigns.
- New social/community features.
- New data providers unless Tim explicitly prioritizes them.
- Production deployment changes without explicit approval.
- Broad upstream refactors unrelated to Tim's current page.

## Tech Stack

- Frontend: Vite 4, React 18, TypeScript, Tailwind CSS, React Router, Recharts.
- Maps: MapLibre via `react-map-gl/maplibre`, with a privacy-mode fallback style.
- Data display: `src/static/activities.json`, generated SVG assets in `assets/`.
- Sync/generation: Python scripts under `run_page/`, SQLite at `run_page/data.db`, GPX/TCX/FIT output folders.
- Automation: GitHub Actions workflow `.github/workflows/run_data_sync.yml`.
- Deployment: Vercel config exists, GitHub Pages workflow exists.

## Data And Security

- Activity files can reveal GPS traces, cities, dates, routes, heart rate, and habits.
- Credentials should stay in local ignored files or GitHub/Vercel secrets only.
- Do not print, upload, or commit secrets or raw personal activity data unless Tim explicitly requests it.
- Prefer privacy-preserving UI changes. `PRIVACY_MODE` is currently enabled in `src/utils/const.ts`.
- Any login, credential, sync, cache, or deployment change needs a risk check before implementation.

## Coding Rules

- Prefer small, local edits that match existing React and Python patterns.
- Do not rewrite upstream architecture unless it removes a real current risk.
- Avoid touching generated data files for UI-only changes.
- Check Git status before edits and after edits.
- Use the smallest meaningful verification: usually `pnpm run build` for frontend changes, focused Python command for data-generation changes, or docs-only inspection for documentation changes.
