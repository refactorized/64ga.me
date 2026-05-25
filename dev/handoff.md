# Handoff — 2026-05-25

Adam is pausing the session after first real play-test of the MVP. **Verdict: "too slow and boring already."** Layout has rough edges he's chosen to defer. He raised the possibility of revisiting the 36-fact angle (commutative collapse) as the next direction.

This is a pause, not a kill. The plumbing is sound; the *felt experience* didn't land.

## Read first when resuming

1. This file
2. [dev/design.md](design.md) — current MVP spec
3. [dev/decisions.md](decisions.md) — locked decisions + rationale
4. [dev/questions.md](questions.md) — active threads
5. [CLAUDE.md](../CLAUDE.md) — repo conventions

## What's running

- `cd app && npm run dev` — Vite at http://localhost:5173 (may bump to 5174 etc. if a prior dev server is still alive in the background; check the log)
- `npm run build` passes clean
- All work prior to the layout switcher is in commit `70c5e94`. **Layout switcher + handoff edits are uncommitted in the working tree.** Adam can commit, stash, or leave — they'll be there next time either way.

## What works end-to-end (playable)

Full loop: home → ready → gameplay → finished, with:
- Multi-profile localStorage, best-time per profile
- BG hue-cycling 8×8 grid, completed cells light up with their product
- Prompt-large above a 4-button answer area
- Three answer layouts (diamond default / inverted-T / 2×2), picker on Ready screen, persists, animated CSS transitions between layouts
- Keyboard input (arrows + WASD) on diamond + inverted-T; auto-disabled on 2×2
- 3s correction lockout with correct-button pulse
- Missed fact reshuffles to back half of deck
- Hand-curated distractor pools per canonical fact pair in `app/src/data/distractors.ts`

## Adam's felt-experience signal

> "too slow and boring already"

Candidate causes worth examining next session (not yet validated):

- **Session length.** 64 facts × ~3-5s each = 3-5 min minimum. Possibly too long for a snappy dopamine loop. (Direct hit on A2 / the 36-angle reconsideration.)
- **3s correction lockout.** Reasoned design choice but it kills momentum hard. Could try 1.5s.
- **No juice on correct.** Cell lights up — that's it. No sound, no flourish, no streak. The "always win" framing isn't *felt*.
- **No escalation.** Pure random means easy 2× facts mix with hard 7×8 in no pattern.
- **Stale prompt.** No build/anticipation between questions.

## The "36-inspired angle" Adam raised

He floated collapsing to 36 unique facts (commutative pairs as one). This **revisits A2** (decisions.md), which locked in 64 with an explicit "future toggle" escape hatch.

Implications if pursued:
- Session ~halves: ~3-5 min
- Grid representation: triangular, or keep 8×8 with paired cells lighting together
- Doesn't address juice/escalation/lockout problems on its own
- Should be one option in a wider felt-experience tune-up, not a silver bullet

## Other felt-experience knobs (if not 36)

- Snappier animations (cell-fill 400ms → 150ms)
- Audio feedback (correct chime, non-punishing wrong sound)
- Streak counter on screen ("5 in a row")
- Running pace vs best ("ahead by 12s")
- Pre-warm the next question while correction plays so transition feels instant after lockout
- Cut correction lockout to 1.5s

Recommend treating these as a menu the next session picks 2-3 from to playtest, not all at once.

## File map for fast re-orientation

- `app/src/state/session.ts` — core loop (deck, currentQuestion, correction, finishSession)
- `app/src/state/settings.ts` — answer layout persistence
- `app/src/state/profiles.ts` — multi-profile localStorage
- `app/src/data/distractors.ts` — hand-curated per-fact pools (tune freely)
- `app/src/data/facts.ts` — the 64 facts + key helpers
- `app/src/screens/gameplay.tsx` — prompt + diamond + keyboard
- `app/src/components/grid.tsx` — BG hue-cycle grid
- `app/src/index.css` — all CSS, single cascade-friendly stylesheet
- `factor64/`, `web/` — reference-only historical skeletons, do not extend

## Layout issues Adam is aware of (deferred)

- He has tweaks in mind; not blocking the next session
- The `flex-shrink: 0` + explicit `height: 20rem` on `.answers` is the workaround for absolute children giving zero intrinsic height. If layout is reworked, that fix may not be needed.

## Don't on resume

- Don't silently revisit A2 (64→36). Treat it as a decision to make explicitly with Adam.
- Don't add per-fact stats, sounds, mnemonics, or PWA service-worker work as part of a felt-experience fix unless explicitly scoped — they're out of MVP per D13.
- Don't add cloud / auth — still firmly out.
