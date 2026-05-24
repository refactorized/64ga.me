// Distractor pools for each canonical fact pair (min,max).
// Per-pair pool is hand-curated, mixing off-by-one product, off-by-one factor,
// digit transpositions, and the occasional absurd answer. Some are intentionally
// silly. Lower-magnitude facts (2x2, 2x3) have fewer plausible alternates.
//
// 3 distractors are drawn from a pool per round so buttons vary across plays.
// Edit freely; just keep all entries != the correct product.

export const DISTRACTOR_POOL: Record<string, number[]> = {
  '2,2': [3, 5, 6, 8, 22], // = 4
  '2,3': [4, 5, 7, 8, 32], // = 6
  '2,4': [6, 9, 10, 16, 24], // = 8
  '2,5': [5, 8, 12, 15, 20], // = 10
  '2,6': [10, 14, 16, 21, 24], // = 12
  '2,7': [12, 16, 18, 24, 41], // = 14
  '2,8': [14, 18, 24, 61, 64], // = 16
  '2,9': [16, 20, 21, 27, 81], // = 18
  '3,3': [6, 8, 12, 27, 99], // = 9
  '3,4': [9, 14, 15, 16, 21], // = 12
  '3,5': [12, 18, 20, 25, 51], // = 15
  '3,6': [15, 16, 21, 24, 81], // = 18
  '3,7': [12, 14, 18, 24, 28], // = 21
  '3,8': [21, 27, 28, 32, 42], // = 24
  '3,9': [21, 24, 30, 36, 72], // = 27
  '4,4': [8, 12, 20, 24, 64], // = 16
  '4,5': [16, 18, 24, 25, 30], // = 20
  '4,6': [18, 20, 28, 30, 42], // = 24
  '4,7': [21, 24, 32, 35, 82], // = 28
  '4,8': [23, 24, 28, 36, 40], // = 32
  '4,9': [27, 32, 40, 45, 63], // = 36
  '5,5': [20, 24, 30, 35, 52], // = 25
  '5,6': [24, 25, 33, 35, 40], // = 30
  '5,7': [28, 30, 40, 42, 53], // = 35
  '5,8': [24, 32, 35, 45, 48], // = 40
  '5,9': [35, 36, 40, 49, 54], // = 45
  '6,6': [30, 35, 42, 48, 63], // = 36
  '6,7': [24, 35, 36, 48, 49], // = 42
  '6,8': [40, 42, 54, 56, 84], // = 48
  '6,9': [45, 48, 56, 60, 63], // = 54
  '7,7': [42, 48, 56, 63, 94], // = 49
  '7,8': [48, 49, 63, 64, 65], // = 56
  '7,9': [36, 56, 64, 72, 81], // = 63
  '8,8': [46, 56, 63, 72, 81], // = 64
  '8,9': [27, 56, 63, 64, 81], // = 72
  '9,9': [18, 63, 64, 72, 99], // = 81
}

export function getDistractorPool(a: number, b: number): number[] {
  const key = `${Math.min(a, b)},${Math.max(a, b)}`
  return DISTRACTOR_POOL[key] ?? []
}
