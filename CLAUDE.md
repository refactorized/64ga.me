# 64ga.me

A PWA multiplication-fact game. Players run through the essential 2x2..9x9 multiplication facts as fast as they can. Wrong answers briefly show the correct one then reshuffle into the queue. You always win; you only race yourself.

## Repository layout

- `app/` — **the build.** Vite + Preact + `@preact/signals` + TypeScript. Run from inside this dir.
- `web/` — historical skeleton #1 (Lit + immer, decorative GameGrid). Reference only. Do not extend.
- `factor64/` — historical skeleton #2 (Preact + signals, screen flow + multi-user storage, STOP-button gameplay placeholder). Reference only. Do not extend.
- `dev/` — shared team folder for Adam + Claude. `design.md` (current spec), `decisions.md` (append-only log), `questions.md` (active blockers). Single source of truth for "what are we building and why."
- `.claude/skills/` — project-local skills.

## App structure (`app/src/`)

- `main.tsx`, `app.tsx`, `index.css` — entry, screen switch, global CSS (single cascade-friendly stylesheet, semantic class names, CSS custom properties for theming).
- `state/` — signal stores: `screen.ts`, `profiles.ts` (localStorage-backed), `session.ts` (deck, timer, completed set).
- `data/` — `facts.ts` (the 64 facts), `distractors.ts` (per-fact hand-curated distractor pools).
- `lib/` — `shuffle.ts`, `format.ts`.
- `screens/` — `home`, `ready`, `gameplay` (currently a stub: BG grid + a button that marks a random cell complete), `finished`.
- `components/grid.tsx` — the BG 8×8 grid with hue-cycle palette ported from `web/GameGrid`.

## Conventions

- CSS: single global stylesheet, semantic class names, CSS custom properties on `:root`. No CSS-in-JS, no utility classes. Adam owns CSS taste.
- State: signals over hooks for app state; `useState` only for local UI state (form input).
- Persistence keys: `factor64_*` namespace in localStorage (inherited from factor64 skeleton — no migration cost).
- Profile API: `addProfile`, `removeProfile`, `selectProfile`, `updateBest`, `currentProfile()`.

## Working conventions

- Design intent lives in `dev/design.md`. Keep it tight; move history to `dev/decisions.md`.
- Track open questions in `dev/questions.md` rather than letting them rot in chat.
- This is a side project Adam is restarting after a long pause. Push back hard on scope creep, premature abstractions, and anything that delays a playable MVP. Skepticism is the job, not a courtesy.
- Bias toward small reversible PRs and a working app at every commit.

## Out of scope for MVP (do not build yet)

- Auth, cloud profiles, donations, anti-scam brand strategy. Real concerns, wrong time.
