# 64ga.me — design (MVP)

A PWA multiplication-fact trainer. Players run through the 64 essential facts (2×2..9×9) as fast as possible. Wrong answers briefly show the correct fact, then that fact is reshuffled into the back half of the deck. You always win; you only race yourself.

This file is the *current* spec. Rationale and alternatives considered live in [decisions.md](decisions.md). Unresolved questions live in [questions.md](questions.md).

## Audience and tone

Anyone drilling essential multiplication facts. Realistic primary user: a learner (kid or adult) on a phone, 5–10 min sessions, a couple times a day. Tone target: casino-game dopamine loop + clean post-pixel aesthetic. Always-win framing.

## Stack

- Vite + TypeScript + Preact + `@preact/signals`
- localStorage for profiles and best times
- Plain CSS, cascade-driven; semantic class names; CSS custom properties for all colors/sizes/timings (themable Zen Garden style)
- PWA: web manifest + service worker, installable and offline-capable

## Screen flow

`home` → `ready` → `gameplay` → `finished` → (play again | home)

- **home** — list of local profiles; add/select/remove
- **ready** — selected profile name + best time + Start
- **gameplay** — background 8×8 grid (completed cells lit), current prompt, 4 answer buttons in a diamond
- **finished** — total time, new-personal-best celebration when applicable, Play Again / Home

## Core loop

1. Initialize deck: shuffled queue of all 64 facts `(a, b)` for `2 ≤ a, b ≤ 9`.
2. Start timer. Pop next fact from front of deck.
3. Render prompt `a × b = ?` + 4 answer buttons (1 correct + 3 distractors drawn from that fact's pool).
4. On **correct** answer: mark cell complete in background grid, brief animation, advance to next fact.
5. On **wrong** answer:
   - Lock input immediately.
   - Display `a × b = product` and animate the correct button for **3 seconds**.
   - Reinsert the fact at a random position in the **back half** of the remaining deck.
   - Unlock input, advance to next fact.
6. When deck is empty: stop timer, go to `finished`. If `elapsedMs < profile.bestMs` (or no prior best), update best and surface the celebration.

## Input

- Touch / click on answer buttons (primary on phone).
- Arrow keys and WASD map to diamond positions: ↑/W = top, →/D = right, ↓/S = bottom, ←/A = left.
- Both modalities are always active; no setting or toggle in MVP.
- During the 3s correction display, all input is locked. (Future: tapping locked buttons triggers screen-shake.)

## Distractors

- 4 buttons per question: 1 correct + 3 distractors.
- Distractor pool is **hardcoded per fact** in a static table. Pool composition mixes: off-by-one product, off-by-one factor, digit transpositions, and a few random-wrong "ridiculous" entries.
- Pool size varies by fact — low-magnitude facts (2×2, 2×3) may have fewer plausible alternates than mid-magnitude facts like 7×8.
- 3 distractors are drawn from the pool per round so buttons vary across plays.
- Table lives in code (e.g. `src/data/distractors.ts`) and is hand-tunable.

## Background grid

- 8×8 cells, one per `(a, b)` pair.
- Un-completed cells: blank outline only — no `a × b` text shown pre-completion.
- Completed cells: show the product, lit with the rotating hue palette ported from `web/GameGrid`. Palette cycles in the background, slower than the current 100ms tick (target ~500ms).
- The grid sits in the background; the prompt and answer diamond overlay its lower portion.
- The visual weight of all 64 blank cells at session start is intentional — clearing the grid is the felt task the game is designed to make painless.

## Layout

Phone portrait sketch (not pixel-perfect; iterate against the running app):

```
┌────────────────────────────┐
│ ┌──┬──┬──┬──┬──┬──┬──┬──┐  │
│ │  │  │  │  │  │  │  │  │  │
│ ├──┼──┼──┼──┼──┼──┼──┼──┤  │
│ │  │14│  │  │  │  │  │  │  │   ← background 8×8 grid
│ ├──┼──┼──┼──┼──┼──┼──┼──┤  │     completed cells show
│ │  │  │  │  │28│  │  │  │  │     product, hue-cycle in BG
│ ├──┼──┼──┼──┼──┼──┼──┼──┤  │     un-completed = blank
│ │  │  │  │  │  │  │  │  │  │
│ ├──┼──┼──┼──┼──┼──┼──┼──┤  │
│ │  │  │  │  │  │  │  │  │  │
│ ├──┼──┼──┼──┼──┼──┼──┼──┤  │
│ │  │  │  │  │  │  │  │  │  │
│ ├──┼──┼──┼──┼──┼──┼──┼──┤  │
│ │  │  │  │  │  │  │  │  │  │
│ ├──┼──┼──┼──┼──┼──┼──┼──┤  │
│ │  │  │  │  │  │  │  │  │  │
│ └──┴──┴──┴──┴──┴──┴──┴──┘  │
│                            │
│        ╔═══════════╗       │   ← prompt overlays grid
│        ║   7 × 8   ║       │     (lower-mid)
│        ╚═══════════╝       │
│                            │
│           ┌────┐           │
│           │ 49 │           │   ← N
│           └────┘           │
│      ┌────┐    ┌────┐      │
│      │ 48 │    │ 63 │      │   ← W   E
│      └────┘    └────┘      │
│           ┌────┐           │
│           │ 56 │           │   ← S
│           └────┘           │
│                            │
│  00:14.32                  │   ← timer (HUD)
└────────────────────────────┘
```

In practice the grid occupies roughly the upper 50–60% of the viewport; prompt and diamond share the lower 40–50%. Exact ratios are CSS, not spec — Adam owns the tuning.

## Data model

```ts
type Fact = { a: number; b: number; product: number }

type Profile = { name: string; bestMs?: number }

type Session = {
  startedAtMs: number | null
  elapsedMs: number
  deck: Fact[]                  // remaining, front = next
  completed: Set<string>        // keys like "3,7"
  current: {
    fact: Fact
    choices: number[]           // length 4, one of them is fact.product
  } | null
  correction: { fact: Fact } | null  // non-null = locked, showing correction
}
```

Persisted (localStorage):
- `factor64_profiles` — `Profile[]`
- `factor64_currentProfile` — `string | null`

In-memory only: `Session`, timer interval.

## MVP scope

**In:**
- Core loop above
- Multi-profile local
- Best-time per profile, personal-best surfacing
- PWA: installable, offline-capable
- Touch + keyboard input
- Background hue grid + completed cells

**Out (post-MVP, in rough order of when we'd revisit):**
- Per-fact stats / weighted selection / spaced repetition
- Sounds (non-punishing)
- Screen-shake "frustration valve" when player taps during correction lockout
- Active-cell pulled-to-foreground effect
- Commutative-pair "two-for-one" mode toggle
- In-game settings UI (keyboard toggle, palette disable)
- Custom per-fact mnemonics
- Donations + brand authenticity strategy
- Auth / cloud sync
