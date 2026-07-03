# Project Agent Rules

Before development, read these files in order:

1. `.ai/PROJECT.md`
2. `.ai/CURRENT.md`
3. `.ai/DECISIONS.md`

Then check `git status --short` and protect unrelated user changes.

## Project Commands

- Install frontend deps: `pnpm install`
- Start local app: `pnpm run dev`
- Build frontend: `pnpm run build`
- Lint frontend: `pnpm run lint`
- Format/check project files: `pnpm run check`
- Install Python deps: `pip install -r requirements.txt`
- Generate SVGs from local DB: `python3 run_page/gen_svg.py --from-db`

`pnpm run lint` and `pnpm run check` can rewrite files. Use them intentionally and inspect the diff.

## Safety Rules

- Do not read or print `.env`, secrets, tokens, `config.yaml`, or GitHub secret values unless Tim explicitly authorizes it.
- Treat `run_page/data.db`, `src/static/activities.json`, `GPX_OUT/`, `TCX_OUT/`, `FIT_OUT/`, `activities/`, and generated SVG/PNG outputs as personal activity data.
- Do not run `pnpm run clean`, `pnpm run data:clean`, or any command that deletes activity outputs unless Tim explicitly asks.
- Do not use `git add .`. Stage only files related to the current task.
- Never commit `node_modules/`, `dist/`, `.vercel/`, `.next/`, `.venv/`, secrets, generated backups, or build output.
- Never deploy Production unless Tim explicitly asks for production deployment.

## Product Rules

- Keep this a simple personal running homepage. Favor privacy, reliability, and maintainability over feature expansion.
- For new features, first answer: who needs it, whether it belongs to the current sprint, the smallest useful version, and data/privacy/deployment risks.
- For small copy fixes or scoped UI bugs, proceed after reading project memory and related code.
