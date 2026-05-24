# Decisions log

Append-only. Each entry: date, decision, reasoning, alternatives considered. When a decision is revisited, add a new entry — don't rewrite history.

---

## 2026-05-23 — Two prior skeletons live in-repo as reference only

`web/` (Lit + immer, decorative GameGrid) and `factor64/` (Preact + signals, screen flow + multi-user persistence, no actual game) are both kept in the repo as historical reference. Neither is the path forward as-is. No code from either is load-bearing for the new build; we lift *ideas* (screen flow, user model, palette aesthetic) but plan to rewrite components.

---

## 2026-05-24 — MVP design locked in (round 1)

Adam worked through all open questions inline in `questions.md`. Locked-in choices (question IDs match prior `questions.md`):

- **F1 Framework:** Preact + `@preact/signals` + Vite + TS. Lit was the original exploration vehicle; we're picking Preact for the lowest-ceremony screen+state model. Hue-cycle aesthetic from `web/GameGrid` will be ported as CSS + signals.
- **A1 Input modality:** 4-button multiple choice. Adam's reasoning: no penalty for slow typers, distractor design becomes a learning surface, visual memory, phone-friendly, supports "sub-minute for 64 facts" ceiling.
- **A2 Session length:** 64 facts. Commutative pairs stay as separate cells. Grid integrity > pedagogical compression. Future toggle to collapse to 36 (with one answer lighting two cells) is left open.
- **A3 Question order:** pure random for MVP. Weighted / spaced-repetition is a fast follow once gameplay feels right.
- **A4 Correction display duration:** 3 seconds. App-wide constant.
- **A5 Miss reshuffle:** missed fact reinserted at a random position in the *back half* of the remaining deck.
- **B6 Win condition:** all 64 cells answered correctly. Total time includes correction penalties. That total is the only metric.
- **B7 Per-fact stats:** post-MVP fast follow.
- **B8 Profiles:** multi-profile localStorage, names only, no auth.
- **C9 Progress grid during play:** indicates completed cells only; no active-question highlight. Active-cell-pulled-to-foreground effect is post-MVP.
- **C10 Keyboard:** dual-input always live (touch + arrows/WASD mapped to diamond). No in-game UI to toggle modes for MVP.
- **C11 Hue palette:** keep as background during play, slow it down. Optional disable later if it proves distracting.
- **C12 Correction feedback:** display `a × b = product`, animate the correct button. No sound for MVP. Future sounds will not be punishing.
- **D13 MVP cutline:** core loop + best-time + multi-profile + PWA installable. Defer: per-fact stats, sounds, mnemonics, donations, auth.
- **D14 Aesthetic direction:** casino-loop dopamine + clean post-pixel. Adam owns CSS taste and will iterate. Claude writes simple, cascade-friendly CSS with semantic class names and CSS custom properties for theming (Zen Garden style).

---

## 2026-05-24 — Design loop closed (round 2)

- **F2 Distractor source:** hardcoded per-fact table. Each fact's distractor pool is a mix of: off-by-one product, off-by-one factor, transpositions (e.g. 56 → 65), and a few random-wrong "ridiculous" answers. Low-magnitude facts (2×2, 2×3) may have fewer entries because plausible alternates run out fast. 3 are drawn per round from the pool so buttons vary across plays. Authored once, hand-tuned thereafter.
- **L1 Layout:** two stacked sections, grid in the background with the prompt and answer diamond overlaying the lower portion. Wireframe lives inline in `design.md`. Not pixel-perfect; iterate against the running app.
- **L2 Un-completed cell display:** blank outline (no `a × b` text). The grid is a pure progress meter; its visual weight pre-completion is intentional — the game's job is to make clearing it feel painless. Click handling on the original `web/GameGrid` was demo cruft, not behavior to preserve.
- **S1 Input lockout:** during the 3s correction display, input is locked. Focus and interaction belong wholly to the correction. Future enhancement: tapping locked buttons triggers a screen-shake / wobble so frustration has a humorous outlet — not MVP.
- **K1 Keyboard mapping:** arrows + WASD mapped to diamond positions (↑/W = top, →/D = right, ↓/S = bottom, ←/A = left). No numeric or vim-style keys for MVP.
