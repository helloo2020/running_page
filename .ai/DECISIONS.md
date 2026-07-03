# Decision Log

Append only. Format: date, decision, reason, impact.

## 2026-07-03

Decision: Adopt project-level AI memory files using Tim's AI project system template.

Reason: The project is already customized and contains personal activity data, so future AI work needs stable context, safety rules, and a small-task workflow.

Impact: Future agents should read `AGENTS.md`, `.ai/PROJECT.md`, `.ai/CURRENT.md`, and `.ai/DECISIONS.md` before development.

## 2026-07-03

Decision: Treat activity outputs and generated data as personal data by default.

Reason: Running data can reveal routes, locations, dates, heart rate, and habits.

Impact: Agents should avoid reading, printing, rewriting, deleting, or committing raw activity data unless the task explicitly requires it and Tim has authorized the action.

## 2026-07-03

Decision: Do not run destructive data cleanup commands without explicit confirmation.

Reason: The project contains local generated activity outputs and a SQLite database that may be difficult to recreate safely.

Impact: Commands such as `pnpm run clean` and `pnpm run data:clean` require explicit Tim confirmation before execution.
