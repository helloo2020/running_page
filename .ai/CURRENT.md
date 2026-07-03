# Current State

Last updated: 2026-07-03

## Active Sprint

AI project onboarding and stabilization.

## Current State

- The repository is a customized fork of `running_page`.
- The app displays running/activity stats, a map, yearly summaries, tables, and generated SVG summaries.
- Frontend source is under `src/`.
- Data sync and SVG generation scripts are under `run_page/`.
- Personal/generated activity data exists in `run_page/data.db`, `src/static/activities.json`, `GPX_OUT/`, `activities/`, and `assets/`.
- `PRIVACY_MODE` is enabled in `src/utils/const.ts`.
- Git branch at onboarding: `master`.
- Git worktree before onboarding edits: clean.

## Recent Changes

- Added AI project memory files:
  - `AGENTS.md`
  - `.ai/PROJECT.md`
  - `.ai/CURRENT.md`
  - `.ai/DECISIONS.md`
  - `.ai/BACKLOG.md`

## Known Issues And Risks

- No test files were found during onboarding.
- README TODO still lists tests as incomplete.
- `pnpm run lint` and `pnpm run check` can modify files automatically.
- `pnpm run clean` and `pnpm run data:clean` delete local activity outputs and must not be run without explicit confirmation.
- GitHub Actions currently has a step that uses `git add .` inside CI. Treat workflow edits carefully.
- Public activity output can reveal personal routes and habits.

## Validation Status

- Onboarding inspection completed by reading README files, package/config files, key source files, workflow config, TODO markers, Git history, Git status, and source tree.
- No build or tests were run because this onboarding task only adds documentation and project memory files.

## Deployment Status

- Vercel config exists in `vercel.json`.
- GitHub Pages workflow exists via `.github/workflows/run_data_sync.yml`.
- No deployment was performed during onboarding.

## Next Suggested Task

Decide the next small sprint item before coding. Best first candidates:

1. Run a clean `pnpm run build` baseline.
2. Review privacy exposure of generated public data and map settings.
3. Add minimal smoke validation for the frontend.
